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
} from '@material-ui/core';
import Page from '../../../components/Page';
import { SHIPPER_ENDPOINT } from '../../../api/endpoint';
import ShipperList from './ShipperList';
import API from '../../../api/API';
import { useSelector, useDispatch } from 'react-redux';
import { actLoadShipper } from '../../../actions/index';

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

const ShipperListView = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const shippers = useSelector(state => state.shipper.shippers);

  useEffect(() => {
    setLoading(true);

    API.get(SHIPPER_ENDPOINT)
      .then(async response => {
        if (response.ok) {
          const fetchData = await response.json();
          const shippersData = fetchData.data;
          if (shippersData.length > 0) {
            dispatch(actLoadShipper(shippersData));
            setLoading(false);
          }
        }
      });
  }, [dispatch]);

  return (
    <Page
      className={classes.root}
      title="Shippers">
      <Container maxWidth={false}>
        <Box mt={3}>
          <Grid container spacing={3}>
            {loading
              ? (
                <div style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <CircularProgress />
                </div>
              )
              : <ShipperList shippers={shippers} />}
          </Grid>
        </Box>
      </Container>
    </Page>
  );
};

export default ShipperListView;