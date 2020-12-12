import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles,
  Input,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  CircularProgress,
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
import API from '../../../api/API';
import { actChangeKeyword, actLoadInvoices, actLoadProvider, actLoadProviderName } from '../../../actions/index';
import { INVOICE_ENDPOINT, PROVIDER_ENDPOINT } from '../../../api/endpoint';
import { ACCESS_TOKEN_FABRIC, RESPONSE_STATUS, USER_TOKEN } from '../../../common';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  content: {
    display: 'flex',
    alignItems: 'center',
  },
  searchBox: {
    width: 500,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  loadingModal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiCircularProgress-root': {
      outline: 'none'
    },
  },
}));

const Toolbar = ({ onHandleFileUpload, onHandleFileChange, user, ...rest }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadingModal, setLoadingModal] = useState(false);
  const providers = useSelector(state => state.providers.providers);
  const selectedProvider = useSelector(state => state.providers.provider_name);

  useEffect(() => {
    dispatch(actLoadProviderName(selectedProvider));
  }, [dispatch, selectedProvider]);

  const handleChangeProvider = (event) => {
    dispatch(actLoadProviderName(event.target.value));
  };

  useEffect(() => {
    API.get(PROVIDER_ENDPOINT)
      .then(async response => {
        if (response.status === RESPONSE_STATUS.FORBIDDEN) {
          Cookies.remove(USER_TOKEN);
          Cookies.remove(ACCESS_TOKEN_FABRIC);
          navigate('/', { replace: true });
        }
        if (response.ok) {
          const fetchData = await response.json();
          const providersData = fetchData.data;
          if (providersData.length > 0) {
            dispatch(actLoadProvider(providersData));
          }
        }
      });
  }, [dispatch, navigate]);

  useEffect(() => {
    setLoadingModal(true);
    if (selectedProvider !== 'NONE') {
      let query = null;
      if (user && user.role === 'Admin') {
        query = 'page=1&limit=50&hub_id=none';
      } else {
        query = `page=1&limit=50&hub_id=${user.hub.id}`
      }
      API.get(`${INVOICE_ENDPOINT}/providers/${selectedProvider}?${query}`)
        .then(async response => {
          if (response.ok) {
            const fetchData = await response.json();
            const data = { invoices: fetchData.data.items, meta: fetchData.data.meta };
            dispatch(actLoadInvoices(data));
          }
          setLoadingModal(false);
        });
    } else {
      let query = null;
      if (user && user.role === 'Admin') {
        query = 'page=1&limit=50&hub_id=none';
      } else {
        query = `page=1&limit=50&hub_id=${user.hub.id}`
      }
      API.get(`${INVOICE_ENDPOINT}?${query}`)
        .then(async response => {
          if (response.ok) {
            const fetchData = await response.json();
            const data = { invoices: fetchData.data.items, meta: fetchData.data.meta };
            dispatch(actLoadInvoices(data));
          }
          setLoadingModal(false);
        });
    }
  }, [selectedProvider, dispatch, user]);

  const onChangeKeyword = (event) => {
    const keyword = event.target.value;
    dispatch(actChangeKeyword(keyword));
  }

  let elementProviderMenuItem = [<MenuItem key={-1} value={`NONE`}>NONE</MenuItem>];
  if (providers.length > 0) {
    elementProviderMenuItem.push(providers.map((provider, index) => {
      return <MenuItem value={`${provider.name}`} key={index}>{provider.name}</MenuItem>
    }));
  }

  return (
    <div className={clsx(classes.root)} {...rest}>
      {(user && user.role === 'Admin')
        ? <Box
          display="flex"
          justifyContent="flex-end"
        >
          <Input type="file" onChange={(e) => onHandleFileChange(e)} />
          <Button
            className={classes.importButton}
            onClick={(e) => onHandleFileUpload(e)}
            color="primary"
            variant="contained"
            style={{ color: 'white', marginLeft: 10 }}
          >
            Import Excel
        </Button>
        </Box>
        : null
      }
      <Box mt={3}>
        <Card>
          <CardContent className={classes.content}>
            <Box className={classes.searchBox}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Search Invoice..."
                variant="outlined"
                onChange={(event) => onChangeKeyword(event)}
              />
            </Box>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">Provider</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                label="Provider"
                value={selectedProvider}
                onChange={handleChangeProvider}
              >
                {elementProviderMenuItem}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Box>
      <Modal open={loadingModal} className={classes.loadingModal}>
        <CircularProgress />
      </Modal>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
};

export default Toolbar;