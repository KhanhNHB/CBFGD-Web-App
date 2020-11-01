import React, {
  useState,
  useEffect
} from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Page from '../../../components/Page';
import Toolbar from './Toolbar';
import InvoicesList from './InvoicesList';
import axios from 'axios';
import {
  INVOICE_ENDPOINT
} from '../../../api/endpoint';
import Cookies from 'js-cookie';
import { USER_TOKEN } from '../../../common';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%'
  }
}));

const Invoices = () => {
  const classes = useStyles();
  const [invoices, setInvoices] = useState([]);
  const [fileSelected, setFileSelected] = useState(null);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const onHandleFileUpload = async () => {
    if (!fileSelected) {
      alert('Please choose file!');
      return;
    }

    const formData = new FormData();
    formData.append("file", fileSelected.fileSelected);
    const response = await axios.post(INVOICE_ENDPOINT, formData, {
      headers: {
        'Authorization': 'Bearer ' + Cookies.get(USER_TOKEN)
      }
    });

    if (response.status !== 201) {
      return;
    }

    fetchInvoice();
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setFileSelected({ fileSelected: file });
  }

  const fetchInvoice = async () => {
    const response = await fetch(INVOICE_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cookies.get(USER_TOKEN)
      },
    });

    if (response.status !== 200) {
      return;
    }

    const json = await response.json();
    const result = json.data;

    const onSuccess = (data) => {
      setInvoices(data);
    };

    onSuccess(result);
  }

  const onReload = async () => {
    fetchInvoice();
  };

  return (
    <Page
      className={classes.root}
      title="Invoices">
      <Container maxWidth={false}>
        <Toolbar onHandleFileUpload={onHandleFileUpload} onHandleFileChange={onFileChange} />
        <Box mt={3}>
          <Grid container spacing={3}>
            <InvoicesList invoices={invoices} onReload={onReload} />
          </Grid>
        </Box>
      </Container>
    </Page>
  );
};

export default Invoices;
