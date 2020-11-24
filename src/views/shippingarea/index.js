import React, { useEffect } from 'react';
import { Map, GoogleApiWrapper, Marker, Circle } from 'google-maps-react';
import API from '../../api/API';
import { HUB_ENDPOINT, INVOICE_ENDPOINT } from '../../api/endpoint';
import { useDispatch, useSelector } from 'react-redux';
import { actGetListHub, actGetListInvoice, actLoadInvoiceList } from '../../actions';

export function MapContainer(props) {
  const dispatch = useDispatch();

  const mapStyles = {
    width: '100%',
    height: '80%',
  };
  const hubLocation = useSelector(state => state.hub.listHub);
  const invoiceLocation = useSelector(state => state.invoice.invoiceList);

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
  }, []);

  const moveMarker = (marker) => {
    // ..
  }

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
          width: 16,
          height: 16,
          scaledSize: new window.google.maps.Size(22, 22)
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
    </>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAtGg0XWituHRy95vbyislioKh59n_PxHY'
})(MapContainer);

