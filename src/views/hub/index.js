import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker, Circle, InfoWindow } from 'google-maps-react';
import API from '../../api/API';
import { HUB_ENDPOINT, INVOICE_ENDPOINT, PROFILE_ENDPOINT } from '../../api/endpoint';
import { useDispatch, useSelector } from 'react-redux';
import { actGetListHub, actLoadInvoices, actLoadProfile } from '../../actions';
import { Box, Button, Container, Modal, Snackbar } from '@material-ui/core';
import ModalHubAdd from '../../components/ModalHubAdd';
import { ROLE, USER_TOKEN } from '../../common';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import formatPrice from '../../utils/formatPrice';
import Alert from '@material-ui/lab/Alert';

export function MapContainer(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mapStyles = {
    width: '100%',
    height: '100%',
  };

  const hubLocation = useSelector(state => state.hub.listHub);
  const [openHub, setOpenHub] = useState(false);
  const [name, setName] = useState('');
  const [radius, setRadius] = useState('');
  const [status, setStatus] = useState('Active');
  const [id, setId] = useState('');
  const [user, setUser] = useState(null);
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [invoiceLocation, setInvoiceLocation] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');

  const handleOpenHub = () => {
    setOpenHub(true);
  }

  const handleOpenAddHub = () => {
    setName('');
    setRadius('');
    setId('');
    setStatus('Active');
    handleOpenHub();
  }

  const handleCloseHub = (isChange, isCreated) => {
    if (isChange) {
      if (isCreated) {
        setMessage('Create Hub Sucess!');
      } else {
        setMessage('Update Hub Sucess!');
      }
      setOpenSnackbar(true);
    }
    setOpenHub(false);
  }

  useEffect(() => {
    const fetchOrder = async (user) => {
      let query = "none";
      if (user.roleId === ROLE.HUB_MANAGER) {
        query = user.hubId;
      }

      const response = await API.get(`${INVOICE_ENDPOINT}/status/available?hub_id=${query}`);
      if (response.ok) {
        const fetchData = await response.json();
        setInvoiceLocation(fetchData.data);
        dispatch(actLoadInvoices(fetchData.data));
      }
    };

    const fetchHub = async (user) => {
      let query = 'none';
      if (user.roleId === ROLE.HUB_MANAGER) {
        query = user.phone;
      }

      const response = await API.get(`${HUB_ENDPOINT}?page=1&limit=50&hub_manager_phone=${query}`);
      if (response.ok) {
        const fetchData = await response.json();
        fetchOrder(user);
        dispatch(actGetListHub(fetchData.data));
      }
    };

    const readCookie = async () => {
      const user = Cookies.get(USER_TOKEN);
      if (user) {
        const response = await API.post(`${PROFILE_ENDPOINT}`, {
          "access_token": user
        });

        if (response.ok) {
          const fetchData = await response.json();
          setUser(fetchData.data);
          fetchHub(fetchData.data);
          dispatch(actLoadProfile(fetchData.data));
        }
      }
    };

    readCookie();
  }, [dispatch, navigate]);

  const onMarkerClick = (evt) => {
    setId(evt.id);
    setName(evt.title);
    setRadius(evt.radius);
    setStatus(evt.status);
    if (user && user.roleId === ROLE.ADMIN) {
      handleOpenHub();
    }
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
          title={store.address}
          id={store.id}
          radius={store.radius}
          status={store.status}
          label={((store.address).length > 20) ? (((store.address).substring(0, 20 - 3)) + '...') : store.address}
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
      setSelectedPlace(props.invoice);
      setActiveMarker(marker);
      setShowingInfoWindow(true);
    }

    if (invoiceLocation && invoiceLocation.length) {
      return invoiceLocation.map((invoice, index) => {
        return (
          <Marker
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
            invoice={invoice}
          />
        );
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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);

  };

  return (
    <>
      <Map
        google={props.google}
        zoom={12}
        style={mapStyles}
        initialCenter={{ lat: 10.8061536, lng: 106.6853458 }}
      >
        <InfoWindow
          marker={activeMarker}
          visible={showingInfoWindow}>
          <div>
            {selectedPlace
              ? (
                <>
                  <p style={{ fontSize: 16 }}><span style={{ fontWeight: 'bold' }}>ID: </span>{selectedPlace.id}</p>
                  <p style={{ fontSize: 16 }}><span style={{ fontWeight: 'bold' }}>Code: </span>{selectedPlace.code}</p>
                  <p style={{ fontSize: 16 }}><span style={{ fontWeight: 'bold' }}>Receiver Name: </span> {selectedPlace.receiver_name}</p>
                  <p style={{ fontSize: 16 }}><span style={{ fontWeight: 'bold' }}>Receiver Phone: </span>{selectedPlace.receiver_phone}</p>
                  <p style={{ fontSize: 16 }}><span style={{ fontWeight: 'bold' }}>Address: </span>{selectedPlace.address}</p>
                  <p style={{ fontSize: 16 }}><span style={{ fontWeight: 'bold' }}>Total Quantity: </span>{selectedPlace.quantity}</p>
                  <p style={{ fontSize: 16 }}><span style={{ fontWeight: 'bold' }}>Total Amount: </span>{formatPrice.format(selectedPlace.total_amount) + " VND"}</p>
                  <p style={{ fontSize: 16 }}><span style={{ fontWeight: 'bold' }}>Shipping Fee: </span>{formatPrice.format(selectedPlace.shipping_fee) + " VND"}</p>
                </>
              )
              : ''
            }
          </div>
        </InfoWindow>
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
            {(user && user.roleId === ROLE.ADMIN)
              ? <Button color="primary" onClick={handleOpenAddHub} variant="contained" style={{
                color: 'white',
                height: 45,
                width: 100,
                marginLeft: 120
              }}
              >
                Add Hub
              </Button>
              : null}
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
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message={`Import Sucess!`}
        >
          <Alert onClose={handleCloseSnackbar} severity='success'>
            {message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyD0yJI0AiNhUii3PUU11HzNJdFLsFQncao'
})(MapContainer);