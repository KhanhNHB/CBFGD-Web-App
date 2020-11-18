import React, { useEffect } from 'react';
import { Map, GoogleApiWrapper, Marker, Circle } from 'google-maps-react';
import API from '../../api/API';
import { HUB_ENDPOINT } from '../../api/endpoint';
import { useDispatch, useSelector } from 'react-redux';
import { actGetListHub } from '../../actions';

export function MapContainer(props) {
  const dispatch = useDispatch();
  const mapStyles = {
    width: '100%',
    height: '80%',
  };
  const hubLocation = useSelector(state => state.hub.listHub);
  const userToken = useSelector(state => state.user.userToken);
  const GOOGLEKEY = "AIzaSyAtGg0XWituHRy95vbyislioKh59n_PxHY";
  useEffect(() => {
    API.get(`${HUB_ENDPOINT}`, userToken)
      .then(async response => {
        if (response.ok) {
          const fetchData = await response.json();
          dispatch(actGetListHub(fetchData.data));
        }
      });
  }, []);

  const displayHubMarkers = () => {
    return hubLocation.map((store, index) => {
      return <Marker position={{
        lat: store.latitude,
        lng: store.longitude
      }}
      />
    })
  }

  let circle;
  const displayCircles = () => {
    return hubLocation.map((store, index) => {
      console.log(store.latitude);
      console.log(store.longitude);
      console.log(store.radius);
      return circle = <Circle center={{ lat: parseFloat(store.latitude), lng: parseFloat(store.longitude) }} radius={parseFloat(store.radius)} strokeColor={"#FF0000"} />
    })
  }

  return (
    <Map
      google={props.google}
      zoom={12}
      style={mapStyles}
      initialCenter={{ lat: 10.8061536, lng: 106.6853458 }}
    >
      {displayHubMarkers()}
      {displayCircles()}
    </Map>
  );
}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyAtGg0XWituHRy95vbyislioKh59n_PxHY'
})(MapContainer)

