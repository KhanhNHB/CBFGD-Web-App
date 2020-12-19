import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles,
} from '@material-ui/core';
import Page from '../../../components/Page';
import Toolbar from './Toolbar';
import InvoicesList from './InvoicesList';
import axios from 'axios';
import {
  INVOICE_ENDPOINT
} from '../../../api/endpoint';
import Cookies from 'js-cookie';
import API from '../../../api/API';
import { USER_TOKEN } from '../../../common';
import { actLoadInvoices } from '../../../actions';
import { useDispatch, useSelector } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';

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
  const dispatch = useDispatch();
  const data = useSelector(state => state.invoice.invoices);
  const selectedProvider = useSelector(state => state.providers.provider_name);
  const [fileSelected, setFileSelected] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const user = useSelector(state => state.profile.profile);

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

    if (response.status === 201) {
      if (selectedProvider === 'NONE') {
        const responseInvoice = await API.get(`${INVOICE_ENDPOINT}?page=1&limit=50&hub_id=none`);
        if (responseInvoice.ok) {
          const fetchInvoice = await responseInvoice.json();
          const dataInvoice = { invoices: fetchInvoice.data.items, meta: fetchInvoice.data.meta };
          dispatch(actLoadInvoices(dataInvoice));
        }
      } else {
        const responseProvider = await API.get(`${INVOICE_ENDPOINT}/providers/${selectedProvider}?page=1&limit=50&hub_id=none`);
        if (responseProvider.ok) {
          const fetchProvider = await responseProvider.json();
          const dataProvider = { invoices: fetchProvider.data.items, meta: fetchProvider.data.meta };
          dispatch(actLoadInvoices(dataProvider));
        }
      }
    }
    setLoadingModal(false);
    setFileSelected(null);
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
        {user && <Toolbar onHandleFileUpload={onHandleFileUpload} onHandleFileChange={onFileChange} user={user} />}
        <Box mt={3}>
          {loadingModal && <LinearProgress />}
          <Grid container spacing={3}>
            {(data && user) && <InvoicesList data={data} user={user} />}
          </Grid>
        </Box>
      </Container>
      {/* <Modal open={loadingModal} className={classes.loadingModal}>
        <CircularProgress />
      </Modal> */}
    </Page>
  );
};

export default Invoices;
