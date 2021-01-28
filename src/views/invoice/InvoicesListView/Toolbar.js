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
import { actChangeKeyword, actLoadAssignHubStatus, actLoadAssignOrderToShipperStatus, actLoadInvoices, actLoadProvider, actLoadProviderName } from '../../../actions/index';
import { INVOICE_ENDPOINT, PROVIDER_ENDPOINT } from '../../../api/endpoint';
import { RESPONSE_STATUS, ROLE, USER_DEVICE_TOKEN, USER_TOKEN } from '../../../common';
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
  const selectAssignHubStatus = useSelector(state => state.assignHubStatus.selectAssignHubStatus);
  const selectAssignOrderToShipperStatus = useSelector(state => state.assignOrderToShipperStatus.selectAssignOrderToShipperStatus);

  // useEffect(() => {
  //   dispatch(actLoadProviderName(selectedProvider));
  // }, [dispatch, selectedProvider]);

  const handleChangeProvider = (event) => {
    dispatch(actLoadProviderName(event.target.value));
  };

  const handleChangeAssignHubStatus = (event) => {
    dispatch(actLoadAssignHubStatus(event.target.value));
  };
  const handleChangeAssignOrderToShipperStatus = (event) => {
    dispatch(actLoadAssignOrderToShipperStatus(event.target.value));
  };

  useEffect(() => {
    API.get(`${PROVIDER_ENDPOINT}`)
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
          }
        }
      });
  }, [dispatch, navigate]);

  useEffect(() => {
    setLoadingModal(true);
    if (selectedProvider !== 'NONE') {
      let query = null;
      if (user && user.roleId === ROLE.ADMIN) {
        query = 'page=1&limit=50&hub_id=none';
      } else {
        query = `page=1&limit=50&hub_id=${user.hubId}`
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
      if (user && user.roleId === ROLE.ADMIN) {
        query = 'page=1&limit=50&hub_id=none';
      } else {
        query = `page=1&limit=50&hub_id=${user.hubId}`
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

  let elementAssignStatusMenuItem = [
    <MenuItem key={-1} value={`NONE`}>NONE</MenuItem>,
    <MenuItem key={0} value={`NOT ASSIGN`}>NOT ASSIGN</MenuItem>,
    <MenuItem key={1} value={`ASSIGNED`}>ASSIGNED</MenuItem>
  ];

  return (
    <div className={clsx(classes.root)} {...rest}>
      {(user && user.roleId === ROLE.ADMIN)
        ? <Box
          display="flex"
          justifyContent="flex-end"
        >
          <Input type="file" onChange={(e) => {
            onHandleFileChange(e);
          }} />
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
                placeholder="Search Order..."
                variant="outlined"
                onChange={(event) => onChangeKeyword(event)}
              />
            </Box>
            {
              user && user.roleId === ROLE.ADMIN
              && <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Asign Status</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  label="Asign Status"
                  value={selectAssignHubStatus}
                  onChange={handleChangeAssignHubStatus}
                >
                  {elementAssignStatusMenuItem}
                </Select>
              </FormControl>
            }
            {
              user && user.roleId === ROLE.HUB_MANAGER
              && <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Asign Status</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  label="Asign Status"
                  value={selectAssignOrderToShipperStatus}
                  onChange={handleChangeAssignOrderToShipperStatus}
                >
                  {elementAssignStatusMenuItem}
                </Select>
              </FormControl>
            }
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