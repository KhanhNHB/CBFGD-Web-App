import React, { useRef, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles,
  Snackbar,
} from '@material-ui/core';
import Page from '../../../components/Page';
import Toolbar from './Toolbar';
import InvoicesList from './InvoicesList';
import axios from 'axios';
import {
  INVOICE_ENDPOINT,
  PROVIDER_ENDPOINT
} from '../../../api/endpoint';
import Cookies from 'js-cookie';
import API from '../../../api/API';
import {
  RESPONSE_STATUS,
  USER_DEVICE_TOKEN,
  USER_TOKEN
} from '../../../common';
import { actLoadInvoices, actLoadProvider, actLoadProviderName } from '../../../actions';
import { useDispatch, useSelector } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import MuiAlert from '@material-ui/lab/Alert';
import { useNavigate } from 'react-router';

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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Invoices = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(state => state.invoice.invoices);
  const user = useSelector(state => state.profile.profile);
  const [fileSelected, setFileSelected] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const onHandleFileUpload = () => {
    if (!fileSelected) {
      alert('Please choose file!');
      return;
    }
    setLoadingModal(true);

    const formData = new FormData();
    formData.append("file", fileSelected.fileSelected);
    axios.post(INVOICE_ENDPOINT, formData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + Cookies.get(USER_TOKEN),
      },
    }).then(async response => {
      if (response.status === 201) {
        setOpenSnackbar(true);

        API.get(PROVIDER_ENDPOINT)
          .then(async response => {
            if (response.status === RESPONSE_STATUS.FORBIDDEN) {
              Cookies.remove(USER_TOKEN);
              Cookies.remove(USER_DEVICE_TOKEN);
              navigate('/', { replace: true });
            }
            if (response.ok) {
              const fetchData = await response.json();
              const providersData = fetchData.data;
              if (providersData.length > 0) {
                dispatch(actLoadProvider(providersData));
                dispatch(actLoadProviderName(`NONE`));
              }
            }
          });

        const responseInvoice = await API.get(`${INVOICE_ENDPOINT}?page=1&limit=50&hub_id=none`);

        if (responseInvoice.ok) {
          const fetchInvoice = await responseInvoice.json();
          const dataInvoice = { invoices: fetchInvoice.data.items, meta: fetchInvoice.data.meta };
          dispatch(actLoadInvoices(dataInvoice));
        }
      }
      setLoadingModal(false);
      setFileSelected(null);
    }).catch(async err => {
      setOpenSnackbar(true);

      API.get(PROVIDER_ENDPOINT)
        .then(async response => {
          if (response.status === RESPONSE_STATUS.FORBIDDEN) {
            Cookies.remove(USER_TOKEN);
            Cookies.remove(USER_DEVICE_TOKEN);
            navigate('/', { replace: true });
          }
          if (response.ok) {
            const fetchData = await response.json();
            const providersData = fetchData.data;
            if (providersData.length > 0) {
              dispatch(actLoadProvider(providersData));
              dispatch(actLoadProviderName(`NONE`));
            }
          }
        });

      const responseInvoice = await API.get(`${INVOICE_ENDPOINT}?page=1&limit=50&hub_id=none`);

      if (responseInvoice.ok) {
        const fetchInvoice = await responseInvoice.json();
        const dataInvoice = { invoices: fetchInvoice.data.items, meta: fetchInvoice.data.meta };
        dispatch(actLoadInvoices(dataInvoice));
      }
      setLoadingModal(false);
      setFileSelected(null);
    });
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setFileSelected({ fileSelected: file });
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Page
      className={classes.root}
      title="Orders">
      <Container maxWidth={false}>
        {user && <Toolbar onHandleFileUpload={onHandleFileUpload} onHandleFileChange={onFileChange} user={user} />}
        <Box mt={3}>
          {loadingModal && <LinearProgress />}
          <Grid container spacing={3}>
            {(data && user) && <InvoicesList data={data} user={user} />}
          </Grid>
        </Box>
      </Container>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={`Import Sucess!`}
      >
        <Alert onClose={handleCloseSnackbar} severity='success'>
          Import Sucess!
        </Alert>
      </Snackbar>
    </Page>
  );
};

export default Invoices;