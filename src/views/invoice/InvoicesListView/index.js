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
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQGdtYWlsLmNvbSIsImZpcnN0X25hbWUiOiJTdXBwb3J0IiwibGFzdF9uYW1lIjoiVGVhbSBHRFMgIiwiYXZhdGFyIjoiIiwicGhvbmUiOm51bGwsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiZ2VuZGVyIjoiTWFsZSIsImFkZHJlc3MiOiIiLCJET0IiOm51bGwsInJvbGUiOiJBZG1pbiIsImlhdCI6MTYwMzM0NTMwMiwiZXhwIjoxNjM0ODgxMzAyfQ.aB0n6MARrZAPjO-SLoim5cB8X4NE88aknXu47rfZu1U'
      }
    });

    if (response.status !== 200) {
      return;
    }
    // const json = await response.json();

    // const result = json.data;
    // console.log(result);

    // const onSuccess = (data) => {
    //   setInvoices(data);
    // };

    // onSuccess(result);
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
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluX2NlZWVmZDYxLWU5YmItNDA4ZC1hZTEwLWFhNTM0MGU4N2QwMyIsImZpcnN0X25hbWUiOiJTdXBwb3J0IiwibGFzdF9uYW1lIjoiVGVhbSBHRFMgIiwiYXZhdGFyIjoiIiwicGhvbmUiOm51bGwsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiZ2VuZGVyIjoiTWFsZSIsImFkZHJlc3MiOiIiLCJET0IiOm51bGwsInJvbGUiOiJBZG1pbiIsImlhdCI6MTYwMzE5ODI0NiwiZXhwIjoxNjM0NzM0MjQ2fQ.IADK3WxGIrLmjpByKNvEjZ7kXa8gTrkqlIlrc1K_mD0'
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
          <Grid
            container
            spacing={3}
          >
            <InvoicesList invoices={invoices} onReload={onReload} />
          </Grid>
        </Box>
        <Box
          mt={3}
          display="flex"
          justifyContent="center"
        >
          <Pagination
            color="primary"
            count={3}
            size="small"
          />
        </Box>
      </Container>
    </Page>
  );
};

export default Invoices;
