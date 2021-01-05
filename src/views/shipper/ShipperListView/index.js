import React, {
  useState,
  useEffect
} from 'react';
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  Modal,
} from '@material-ui/core';
import Page from '../../../components/Page';
import { PROFILE_ENDPOINT, SHIPPER_ENDPOINT } from '../../../api/endpoint';
import ShipperList from './ShipperList';
import API from '../../../api/API';
import { useSelector, useDispatch } from 'react-redux';
import { actLoadProfile, actLoadShipper } from '../../../actions/index';
import { RESPONSE_STATUS, ROLE, USER_DEVICE_TOKEN, USER_TOKEN } from '../../../common';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

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
  }
}));

const ShipperListView = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const [loadingModal, setLoadingModal] = useState(false);
  const data = useSelector(state => state.shipper.shippers);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoadingModal(true);

    const fetchShipper = async (user) => {
      let query = 'page=1&limit=50&hub_manager_phone=';
      if (user.roleId === ROLE.ADMIN) {
        query += 'none';
      } else {
        query += `${user.phone}`;
      }

      const response = await API.get(`${SHIPPER_ENDPOINT}?${query}`);
      if (response.ok) {
        const fetchData = await response.json();
        const data = { shippers: fetchData.data.items, meta: fetchData.data.meta };
        dispatch(actLoadShipper(data));
      } else {
        if (response.status === RESPONSE_STATUS.FORBIDDEN) {
          Cookies.remove(USER_TOKEN);
          Cookies.remove(USER_DEVICE_TOKEN);
          navigate('/', { replace: true });
        }
      }
      setLoadingModal(false);
    }

    const readCookie = async () => {
      const user = Cookies.get(USER_TOKEN);
      if (user) {
        const response = await API.post(`${PROFILE_ENDPOINT}`, {
          "access_token": user
        });

        if (response.ok) {
          const fetchData = await response.json();
          setUser(fetchData.data);
          fetchShipper(fetchData.data);
          dispatch(actLoadProfile(fetchData.data));
        }
      }
    };
    readCookie();
  }, [dispatch, navigate]);

  return (
    <Page
      className={classes.root}
      title="Shippers">
      <Container maxWidth={false}>
        <Box mt={3}>
          <Grid container spacing={3}>
            <ShipperList data={data} user={user} />
          </Grid>
        </Box>
      </Container>
      <Modal open={loadingModal} className={classes.loadingModal}>
        <CircularProgress />
      </Modal>
    </Page>
  );
};

export default ShipperListView;