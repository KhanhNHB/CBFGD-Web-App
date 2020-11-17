import React, { useState } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import { Map, GoogleApiWrapper, Marker, Circle } from 'google-maps-react';


const mapStyles = {
  width: '100%',
  height: '80%',
};
export class MapContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hub: [
      { latitude: 10.8509176, longitude: 106.6297, rad: 6500 },
      { latitude: 10.7870685, longitude: 106.693611, rad: 7000 },
      { latitude: 10.8512383, longitude: 106.7566754 , rad: 8000},
      ]
      
    }
  }

  displayHubMarkers = () => {
    return this.state.hub.map((store, index) => {
      return <Marker  position={{
        lat: store.latitude,
        lng: store.longitude
      }}
      />
      
    })
  }

  displayCircles = () => {
    return this.state.hub.map((store, index) => {
      return <Circle center={{ lat: store.latitude, lng: store.longitude }} radius={store.rad} strokeColor={"#FF0000"}/>
    })
  }
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={12}
        style={mapStyles}
        initialCenter={{ lat: 10.8061536, lng: 106.6853458 }}
      >
        {this.displayHubMarkers()}
        {this.displayCircles()}
      </Map>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyAtGg0XWituHRy95vbyislioKh59n_PxHY'
})(MapContainer);