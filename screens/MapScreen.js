import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text
} from 'react-native';
import MapView, { Heatmap, PROVIDER_GOOGLE, Marker, Callout, Polygon } from 'react-native-maps';
import { AuthContext } from '../navigation/AuthProvider';

export default class HeatMap extends Component {

  

  static contextType = AuthContext
 
  static navigationOptions = {
    title: 'Denver',
  };

  state = {
       initialPosition: {
      latitude: 39.7453,//40
      longitude: -105.0007,//-74
      latitudeDelta: 0.09,
      longitudeDelta: 0.035
    },
    markerInit : {
        latitude: 39.7453,
      longitude: -105.0007,
    },
    coordsPoly: [
        {name: 'coors', latitude: 39.7559, longitude: -104.9942}/*coors*/,
        {name: 'elitches', latitude: 39.7502, longitude: -105.0101}/*elitches*/,
        {name: 'dt aquarium', latitude: 39.7518, longitude: -105.0139}/*dt aquarium*/,
        {name: 'conventionC', latitude: 39.7422, longitude: -104.9969}/*convention c*/,
        {name: 'denver skateP', latitude: 39.7596, longitude: -105.0028}/*denver skateP*/,
        {name: 'denver beer', latitude: 39.7582, longitude: -105.0074}/*denver skateP*/,
        {name: 'civic centerP', latitude: 39.7365, longitude: -104.9900}/*denver skateP*/,
        
    ]
  }


  points = [
    { latitude: 39.7828, longitude: -105.0065, weight: .45 },
    { latitude: 40.7121, longitude: -105.0042, weight: .90},
    { latitude: 39.7102, longitude: -105.0060, weight: .80 },
    { latitude: 39.7123, longitude: -105.0052, weight: .70 },
    { latitude: 39.7032, longitude: -105.0042, weight: .60},
    { latitude: 39.7198, longitude: -105.0024, weight: .50 },
    { latitude: 40.7223, longitude: -105.0053, weight: .40},
    { latitude: 39.7181, longitude: -105.0042, weight: .30 },
    { latitude: 39.7124, longitude: -105.0023, weight: .20 },
    { latitude: 39.7648, longitude: -105.0012, weight: .10 },
    { latitude: 40.7128, longitude: -105.0027, weight: .10},
    { latitude: 39.7223, longitude: -105.0153, weight: .70},
    { latitude: 39.7193, longitude: -105.0052, weight: .90 },
    { latitude: 39.7241, longitude: -105.0013, weight: .80 },
    { latitude: 40.7518, longitude: -105.0085, weight: .70},
    { latitude: 39.7599, longitude: -105.0093, weight: .60 },
    { latitude: 40.7523, longitude: -105.0021, weight: .50},
    { latitude: 39.7342, longitude: -105.0152, weight: .40 },
    { latitude: 39.7484, longitude: -106.0042, weight: .30 },
    { latitude: 39.7929, longitude: -106.0023, weight: .20},
    { latitude: 39.7292, longitude: -105.0013, weight: .10 },
    { latitude: 39.7940, longitude: -105.0048, weight: .10},
    { latitude: 39.7874, longitude: -105.0052, weight: .70 },
    { latitude: 39.7824, longitude: -105.0024, weight: .90 },
    { latitude: 39.7232, longitude: -105.0094, weight: .80 },
    { latitude: 40.7342, longitude: -105.0152, weight: .70 },
    { latitude: 40.7484, longitude: -105.0012, weight: .60},
    { latitude: 40.7929, longitude: -105.0073, weight: .50 },
    { latitude: 40.7292, longitude: -105.0013, weight: .40 },
    { latitude: 40.7940, longitude: -105.0058, weight: .30 },
    { latitude: 40.7874, longitude: -105.0352, weight: .20},
    { latitude: 40.7824, longitude: -105.0024, weight: .10},
    { latitude: 40.7232, longitude: -105.0094, weight: .10},
    { latitude: 40.0342, longitude: -106.0152, weight: .20 },
    { latitude: 40.0484, longitude: -106.0012, weight: .90 },
    { latitude: 40.0929, longitude: -106.0073, weight: .80 },
    { latitude: 40.0292, longitude: -105.0013, weight: .70 },
    { latitude: 40.0940, longitude: -105.0068, weight: .60 },
    { latitude: 40.0874, longitude: -105.0052, weight: .50},
    { latitude: 40.0824, longitude: -105.0024, weight: .40 },
    { latitude: 40.0232, longitude: -105.0014, weight: .30}
  ];

  render() {
    const {user, getUserInfectionStatus} = this.context;
    return (
      
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={map => this._map = map}
          style={styles.map}
          initialRegion={this.state.initialPosition}>
            <Polygon coordinates={this.state.coordsPoly}></Polygon>
            <Marker
              coordinate={this.state.markerInit}
              pinColor={'green'}>
                <Callout>
                  <Text>mm/dd/yyyy, 00:00:00 , coord: 35.834, -105.3462, userID</Text>
                </Callout>


            </Marker>
          <Heatmap
            points={this.points}
            radius={40}
            opacity={1}
            gradient={{
              colors: ["green", "orange", "red"],
              startPoints: Platform.OS === 'ios' ? [0.05, 0.1, 0.3]:
                [0.05, 0.1, 0.3],
              colorMapSize: 2000
            }}
          >
          </Heatmap>
        </MapView>
        <View style={styles.bottomView}>
          <Text>{user.uid}</Text>
          <Text>{getUserInfectionStatus()}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  bottomView: {
    width: '100%',
    height: 50,
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
});
