import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  Button
} from 'react-native';
import MapView, { Heatmap, PROVIDER_GOOGLE, Marker, Callout, Polygon } from 'react-native-maps';
import { AuthContext } from '../navigation/AuthProvider';
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/database';
import ProgressButton from '../components/ProgressButton';
const db = firebase.app().database('https://sts0-76694.firebaseio.com');





export default class HeatMap extends Component {

  static contextType = AuthContext;

  constructor(){
    super();
    
    this.state = {
      count:0,
      mapArr: null,
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
          {name: 'denver beer', latitude: 39.7582, longitude: -105.0074}/*denver beer*/,
          {name: 'civic centerP', latitude: 39.7365, longitude: -104.9900}/*civic centerP*/,
          
      ]
    }//this.state

  }//constructor

 
  static navigationOptions = {
    title: 'Denver',
  };

  points = [
    
    /*{ latitude: 39.7828, longitude: -105.0065, weight: .01 },
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
    { latitude: 40.0232, longitude: -105.0014, weight: .30}*/
  ];

  getData = () => {
    this.setState({'mapArr': []})
    this.setState({'count': this.state.count + 1});
    db.ref('users')
    .limitToFirst(10)
    .once('value')
    .then( snapshot => { 
      let oVal = snapshot.val();
      //console.log( Object.keys(oVal).length, oVal[Object.keys(oVal)[0]]);
                        //store object lat, long, weight(convert from infectionStatus) in array
                        //each no try-catch; each users must have infectionStatus, locationInfo.lat/long
                        for(let i=0;i<Object.keys(oVal).length;i++){
                            let fireObj = oVal[Object.keys(oVal)[i]];
                            let mapWeight = fireObj['infectionStatus'];
                            //convert infectionStatus into weights
                            if(mapWeight == 'P'){
                                mapWeight = 90;
                            }else if(mapWeight == 'N'){
                                mapWeight = 1;
                            }else if(mapWeight == 'D'){
                              mapWeight = 100;
                          }else{
                                mapWeight = 35;
                            }
                            let mapObj = {
                                latitude: fireObj['locationInfo']['lat'],
                                longitude: fireObj['locationInfo']['long'],
                                weight: mapWeight
                            }
                            //this.state.mapArr.push(mapObj);
                            this.setState({ mapArr: [...this.state.mapArr, mapObj] }); //simple value
                            
                        }
                        

    });//then
    console.log('in mappArr state', this.state.mapArr);
    this.points = this.state.mapArr;
    console.log('in points ', this.points);

  }//getData function
  
  

  render() {
    const {user, getUserInfectionStatus, getUsers} = this.context;  

    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={map => this._map = map}
          style={styles.map}
          initialRegion={this.state.initialPosition}
          minZoomLevel={0}  // default => 0
          maxZoomLevel={11} // default => 20
        >
          <Heatmap
            points={this.points}
            radius={40}
            opacity={1}
            gradient={{
              colors: ["red", "yellow", "purple"],
              startPoints: [0.10, 0.4, .85],
              colorMapSize: 2000
            }}
          >
          </Heatmap>
        </MapView>
        <View style={styles.bottomView}>
          <View>
            <ProgressButton onPress={this.getData}/>
          </View>
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
    backgroundColor: '#a6e4d0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
});
