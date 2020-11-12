import React, { useState } from 'react';
import {
    Box,
    Container,
    makeStyles
} from '@material-ui/core';
import Page from '../../components/Page';
import { withGoogleMap, GoogleMap } from "react-google-maps";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    }
}));
const GoogleMapExample = withGoogleMap(props => (
    <GoogleMap
      defaultCenter = { { lat: 40.756795, lng: -73.954298 } }
      defaultZoom = { 13 }
    >
    </GoogleMap>
 ));
const ShippingArea = () => {
    const classes = useStyles();

    return (
        <Page
            className={classes.root}
            title="Shipping Area"
        >
            <GoogleMapExample
          containerElement={ <div style={{ height: `500px`, width: '500px' }} /> }
          mapElement={ <div style={{ height: `100%` }} /> }
        />
        </Page>
    );
};

export default ShippingArea;
