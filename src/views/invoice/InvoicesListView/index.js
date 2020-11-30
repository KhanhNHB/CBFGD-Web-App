import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles,
  Modal,
  CircularProgress,
} from '@material-ui/core';
import Page from '../../../components/Page';
import Toolbar from './Toolbar';
import InvoicesList from './InvoicesList';
import axios from 'axios';
import {
  INVOICE_ENDPOINT, PROVIDER_ENDPOINT
} from '../../../api/endpoint';
import Cookies from 'js-cookie';
import { USER_TOKEN } from '../../../common';
import { useDispatch, useSelector } from 'react-redux';
import API from '../../../api/API';
import { actLoadInvoices, actLoadProvider } from '../../../actions';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%'
  },
  loadingModal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiCircularProgress-root': {
      outline: 'none'
    }
  },
}));

const Invoices = () => {
  const classes = useStyles();
  const [fileSelected, setFileSelected] = useState(null);
  const data = useSelector(state => state.invoice.invoices);
  const [loadingModal, setLoadingModal] = useState(false);
  const selectedProvider = useSelector(state => state.providers.provider_name);
  const dispatch = useDispatch();

  const onHandleFileUpload = async () => {
    if (!fileSelected) {
      alert('Please choose file!');
      return;
    }

    setLoadingModal(true);

    const formData = new FormData();
    formData.append("file", fileSelected.fileSelected);
    const response = await axios.post(INVOICE_ENDPOINT, formData, {
      headers: {
        'Authorization': 'Bearer ' + Cookies.get(USER_TOKEN),
      },
    });

    if (response.status !== 201) {
      API.get(PROVIDER_ENDPOINT)
        .then(async response => {
          if (response.ok) {
            const fetchData = await response.json();
            const providersData = fetchData.data;
            if (providersData.length > 0) {
              dispatch(actLoadProvider(providersData));
              API.get(INVOICE_ENDPOINT + `/providers/${selectedProvider}?page=1&limit=50`)
                .then(async response => {
                  if (response.ok) {
                    const fetchData = await response.json();
                    const data = { invoices: fetchData.data.items, meta: fetchData.data.meta };
                    dispatch(actLoadInvoices(data));
                  }
                  setLoadingModal(false);
                });
            }
          }
        });
      return;
    }

    setLoadingModal(false);
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setFileSelected({ fileSelected: file });
  }

  return (
    <Page
      className={classes.root}
      title="Invoices">
      <Container maxWidth={false}>
        <Toolbar onHandleFileUpload={onHandleFileUpload} onHandleFileChange={onFileChange} />
        <Box mt={3}>
          <Grid container spacing={3}>
            <InvoicesList data={data} />
          </Grid>
        </Box>
      </Container>
      <Modal open={loadingModal} className={classes.loadingModal}>
        <CircularProgress />
      </Modal>
    </Page>
  );
};

export default Invoices;
