import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker, Circle } from 'google-maps-react';
import API from '../../api/API';
import { HUB_ENDPOINT, INVOICE_ENDPOINT } from '../../api/endpoint';
import { useDispatch, useSelector } from 'react-redux';
import { actGetListHub, actLoadInvoices } from '../../actions';
import { Box, Button, Container, Modal } from '@material-ui/core';
import ModalHubAdd from '../../components/ModalHubAdd';
import { ACCESS_TOKEN_FABRIC, RESPONSE_STATUS, USER_TOKEN } from '../../common';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export function MapContainer(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mapStyles = {
    width: '100%',
    height: '100%',
  };

  const hubLocation = useSelector(state => state.hub.listHub);
  const invoiceLocation = useSelector(state => state.invoice.invoices);
  const [openHub, setOpenHub] = useState(false);
  const [name, setName] = useState('');
  const [radius, setRadius] = useState('');
  const [status, setStatus] = useState('Available');
  const [id, setId] = useState('');

  const handleOpenHub = () => {
    setOpenHub(true);
  }

  const handleOpenAddHub = () => {
    setName('');
    setRadius('');
    setId('');
    setStatus('Available');
    handleOpenHub(true);
  }

  const handleCloseHub = () => {
    setOpenHub(false);
  }

  useEffect(() => {
    API.get(`${HUB_ENDPOINT}`)
      .then(async response => {
        if (response.status === RESPONSE_STATUS.FORBIDDEN) {
          Cookies.remove(USER_TOKEN);
          Cookies.remove(ACCESS_TOKEN_FABRIC);
          navigate('/', { replace: true });
        }
        if (response.ok) {
          const fetchData = await response.json();
          dispatch(actGetListHub(fetchData.data));
        }
      });

    API.get(`${INVOICE_ENDPOINT}/status/available`)
      .then(async response => {
        if (response.ok) {
          const fetchData = await response.json();
          dispatch(actLoadInvoices(fetchData.data));
        }
      });
  }, [dispatch]);


  const onMarkerClick = (evt) => {
    setId(evt.id);
    setName(evt.title);
    setRadius(evt.radius);
    setStatus(evt.status);
    handleOpenHub(true);
  };

  const displayHubMarkers = () => {
    if (hubLocation && hubLocation.length) {
      return hubLocation.map((store, index) => {
        return (<Marker
          key={index}
          position={{
            lat: store.latitude,
            lng: store.longitude,
          }}
          title={store.name}
          id={store.id}
          radius={store.radius}
          status={store.status}
          label={((store.name).length > 20) ? (((store.name).substring(0, 20 - 3)) + '...') : store.name}
          style={{ color: 'white' }}
          onClick={onMarkerClick}
          {...props}
        >
        </Marker >
        );
      });
    }
  }

  const displayInvoiceMarkers = () => {
    const onMarkerClick = (props, marker, e) => {
      console.log(props);
    }
    if (invoiceLocation && invoiceLocation.length) {
      return invoiceLocation.map((invoice, index) => {
        return <Marker
          key={index}
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
          onClick={onMarkerClick}
          name={invoice.address}
          id={invoice.id}
        />
      });
    }
  };

  const displayCircles = () => {
    return hubLocation.map((store, index) => {
      return <Circle
        key={index}
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
              style={{ color: 'white', height: 45, width: 100, marginLeft: 120 }}
              onClick={handleOpenAddHub}
            >
              Add Hub
        </Button>
          </Box>
        </Container>
        <Modal open={openHub}>
          <ModalHubAdd
            onCLoseHub={handleCloseHub}
            name={name}
            radius={radius}
            status={status}
            id={id}
          />
        </Modal>
      </div>
    </>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAtGg0XWituHRy95vbyislioKh59n_PxHY'
})(MapContainer);