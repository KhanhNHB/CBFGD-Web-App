<<<<<<< HEAD
import React, {
  useState,
  useEffect
} from 'react';
=======
import React from 'react';
>>>>>>> 520cbf431497269a46c308c3ea5590a7d135009c
import {
  Box,
  Container,
  Grid,
  makeStyles,
} from '@material-ui/core';
import Page from '../../../components/Page';
import Toolbar from './Toolbar';
import { SHIPPER_ENDPOINT } from '../../../api/endpoint';
import Cookies from 'js-cookie';
import { USER_TOKEN } from '../../../common';
import ShipperList from './ShipperList';

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
  const classes = useStyles();
  const [shippers, setShippers] = useState([]);

  useEffect(() => {
    fetchShipper();
  }, []);

  const fetchShipper = async () => {
    const response = await fetch(SHIPPER_ENDPOINT, {
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
      setShippers(data);
    };

    onSuccess(result);
  }

  const onReload = async () => {
    fetchShipper();
  };

  return (
    <Page
      className={classes.root}
      title="Shippers">
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          <Grid container spacing={3}>
            <ShipperList shippers={shippers} onReload={onReload} />
          </Grid>
        </Box>
      </Container>
    </Page>
  );
};

export default ShipperListView;
