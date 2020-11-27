import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker, Circle } from 'google-maps-react';
import API from '../../api/API';
import { HUB_ENDPOINT, INVOICE_ENDPOINT } from '../../api/endpoint';
import { useDispatch, useSelector } from 'react-redux';
import { actGetListHub, actLoadInvoiceList } from '../../actions';
import { Box, Button, Container, makeStyles, Modal } from '@material-ui/core';
import ModalHubAdd from '../../components/ModalHubAdd';

export function MapContainer(props) {
  const dispatch = useDispatch();

  const mapStyles = {
    width: '100%',
    height: '100%',
  };

  const hubLocation = useSelector(state => state.hub.listHub);
  const invoiceLocation = useSelector(state => state.invoice.invoiceList);
  const [openHub, setOpenHub] = useState(false);

  const handleOpenHub = () => {
    setOpenHub(true);
  }
  const handleCloseHub = () => {
    setOpenHub(false);
  }
  useEffect(() => {
    API.get(`${HUB_ENDPOINT}`)
      .then(async response => {
        if (response.ok) {
          const fetchData = await response.json();
          dispatch(actGetListHub(fetchData.data));
        }
      });

    API.get(`${INVOICE_ENDPOINT}`)
      .then(async response => {
        if (response.ok) {
          const fetchData = await response.json();
          dispatch(actLoadInvoiceList(fetchData.data));
        }
      });
  }, [dispatch]);


  const displayHubMarkers = () => {
    return hubLocation.map((store, index) => {
      return (
        <Marker
          position={{
            lat: store.latitude,
            lng: store.longitude
          }}
          draggable={true}
          onDragend={(e) => {
            console.log(e);
          }}
        />
      );
    });
  }

  const displayInvoiceMarkers = () => {
    const onMarkerClick = (props, marker, e) => {
      console.log(props);
    }
    return invoiceLocation.map((invoice, index) => {
      return <Marker
        position={{
          lat: invoice.latitude,
          lng: invoice.longitude
        }}
        icon={{
          url: "https://res.cloudinary.com/dvehkdedj/image/upload/v1605980191/gain-icon-point-2_wyxrpw.png",
          width: 5,
          height: 5,
          scaledSize: new window.google.maps.Size(15, 15)
        }}
        label={invoice.id}
        onClick={onMarkerClick}
        name={invoice.address}
        id={invoice.id}
      />
    })
  };

  const displayCircles = () => {
    return hubLocation.map((store, index) => {
      return <Circle
        center={{ lat: store.latitude, lng: store.longitude }}
        radius={store.radius}
        strokeColor={"#FF0000"}
      />
    })
  }

  return (

    <>

      <Map
        google={props.google}
        zoom={12}
        style={mapStyles}
        initialCenter={{ lat: 10.8061536, lng: 106.6853458 }}
      >
        {displayInvoiceMarkers()}
        {displayHubMarkers()}
        {displayCircles()}
      </Map>
      <div>
        <Container>
          <Box
            display="flex"
            justifyContent="flex-end"
            style={{ float: "left", marginLeft: '10%', marginTop: 10 }}
          >
            <Button
              color="primary"
              variant="contained"
              style={{ color: 'white', height: 45, width: 100 }}
              onClick={handleOpenHub}
            >
              Add Hub
        </Button>
          </Box>
        </Container>
        <Modal open={openHub}>
          <ModalHubAdd onCLoseHub={handleCloseHub} />
        </Modal>
      </div>
    </>




  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAtGg0XWituHRy95vbyislioKh59n_PxHY'
})(MapContainer);