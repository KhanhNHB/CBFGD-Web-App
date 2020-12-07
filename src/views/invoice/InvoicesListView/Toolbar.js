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
    }
  },
}));

const Toolbar = ({ onHandleFileUpload, onHandleFileChange, ...rest }) => {
  const classes = useStyles();
  const providers = useSelector(state => state.providers.providers);
  const selectedProvider = useSelector(state => state.providers.provider_name);
  const [loadingModal, setLoadingModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actLoadProviderName(selectedProvider));
  }, [dispatch, selectedProvider]);

  const handleChangeProvider = (event) => {
    dispatch(actLoadProviderName(event.target.value));
  };

  useEffect(() => {
    API.get(PROVIDER_ENDPOINT)
      .then(async response => {
        if (response.ok) {
          const fetchData = await response.json();
          const providersData = fetchData.data;
          if (providersData.length > 0) {
            dispatch(actLoadProvider(providersData));
          }
        }
      });
  }, [dispatch]);

  useEffect(() => {
    if (selectedProvider !== 'NONE') {
      setLoadingModal(true);
      API.get(INVOICE_ENDPOINT + `/providers/${selectedProvider}?page=1&limit=50`)
        .then(async response => {
          if (response.ok) {
            const fetchData = await response.json();
            const data = { invoices: fetchData.data.items, meta: fetchData.data.meta };
            dispatch(actLoadInvoices(data));
          }
          setLoadingModal(false);
        });
    } else {
      setLoadingModal(true);
      API.get(INVOICE_ENDPOINT + '?page=1&limit=50')
        .then(async response => {
          if (response.ok) {
            const fetchData = await response.json();
            const data = { invoices: fetchData.data.items, meta: fetchData.data.meta };
            dispatch(actLoadInvoices(data));
          }
          setLoadingModal(false);
        });
    }
  }, [selectedProvider, dispatch]);

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
      <Box
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
        <Button
          color="primary"
          variant="contained"
          style={{ color: 'white' }}
        >
          Add Invoice
        </Button>
      </Box>
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
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
};

export default Toolbar;