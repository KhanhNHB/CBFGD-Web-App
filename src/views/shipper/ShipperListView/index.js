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
import { SHIPPER_ENDPOINT } from '../../../api/endpoint';
import ShipperList from './ShipperList';
import API from '../../../api/API';
import { useSelector, useDispatch } from 'react-redux';
import { actLoadShipper } from '../../../actions/index';
import { ACCESS_TOKEN_FABRIC, RESPONSE_STATUS, USER_TOKEN } from '../../../common';
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

  const shippers = useSelector(state => state.shipper.shippers);

  useEffect(() => {
    setLoadingModal(true);
    API.get(SHIPPER_ENDPOINT)
      .then(async response => {
        if (response.status === RESPONSE_STATUS.FORBIDDEN) {
          Cookies.remove(USER_TOKEN);
          Cookies.remove(ACCESS_TOKEN_FABRIC);
          navigate('/', { replace: true });
        }
        if (response.ok) {
          const fetchData = await response.json();
          const shippersData = fetchData.data;
          if (shippersData.length > 0) {
            dispatch(actLoadShipper(shippersData));
          }
        }
        setLoadingModal(false);
      });
  }, [dispatch]);

  return (
    <Page
      className={classes.root}
      title="Shippers">
      <Container maxWidth={false}>
        <Box mt={3}>
          <Grid container spacing={3}>
            <ShipperList shippers={shippers} />
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