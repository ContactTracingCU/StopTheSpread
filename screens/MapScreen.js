import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  PermissionsAndroid,
} from 'react-native';
import MapView, { Heatmap, PROVIDER_GOOGLE, Marker, Callout, Polygon } from 'react-native-maps';
import { AuthContext } from '../navigation/AuthProvider';
import Geolocation from 'react-native-geolocation-service';


export default class HeatMap extends Component {

  static contextType = AuthContext; //used to call functions from Auth Provider
  watchId = null; //number
  state = {

    // variables
		forceLocation: true,  //forcefully request location
    highAccuracy: true, //use high accuracy mode for gps
    loading: false, //tracks if app is waiting for location data
    significantChanges: false,  //return locations only if device detects significant change (android only)
    updatesEnabled: false, //tracks whether location updates is turned on or not
    timeoute: 15000, //Request timeout
    maxAge: 10000,  //store gps data for this many ms
    dFilter: 0, //distance filter, don't get gps data if they haven't moved x 
    interv: 15000, //Interval for active location updates (android only)
    fInterval: 10000, //Fastest rate to receive location updates, which might 
                      //be faster than interval in some situations (android only)
    location: {},
    latitude: 0,
    longitude: 0,
    speed: 0,
    timestamp: 0,
    county: null,
    /*
    format of location :{
      "coords": {"accuracy": number, 
                "altitude": number, 
                "heading": number, 
                "latitude": number, 
                "longitude": number, 
                "speed": number}, 
      "mocked": boolean, 
      "timestamp": 1605936837000
    }
    */ 
  };

  hasLocationPermissionIOS = async () => {
    // asks for location permission on iOS 

    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ],
      );
    }

    return false;
  };


  hasLocationPermission = async () => {
    //checks if permission has been granted 
    if (Platform.OS === 'ios') {
      const hasPermission = await this.hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = PermissionsAndroid.check(
      // TODO: this won't run, need to debug
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
    {return hasPermission;}
  }

   async componentDidMount() {
     //called at the beginning 
    if (async () => {
      await this.hasLocationPermission;}) {
        // Start tracking the user's location once the user clicks on this screen.
      this.getLocationUpdates();
    }
  };

  componentWillUnmount() {
    // called when the app terminates
    // stops location tracking 
    this.removeLocationUpdates();
  }

  getCounty = async () => {
    // Sets the county variable to what the geocoder api returns. 
    //This is too slow so the program will execute the next line of code before this finishes.
    let x;
    fetch("https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=" + this.state.longitude + "&y=" + this.state.latitude + "&benchmark=4&vintage=4&format=json")
    .then((response) => response.json())
      .then((json) => {
        x = json.result.geographies.Counties[0].NAME
        this.setState({county: x})
        console.log(json.result.geographies.Counties[0].NAME);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        x = "null";
      });
    return x;
  }

  getLocation = async () => {
    /* Gets the current location of the user ands sets the state values
    */

    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({ loading: true }, () => {
      Geolocation.getCurrentPosition(
        async (position) => {
          this.setState({ location: position, loading: false, latitude: position.coords.latitude,  longitude: position.coords.longitude, speed: position.coords.speed, timestamp: position.timestamp });
          console.log(position);
          await this.getCounty();
          //sends location data to database
          this.context.uploadUserLocation(this.state.location, this.state.county);
          this.context.setUserLocationInfo(this.state.location);

        },
        (error) => {
          this.setState({ loading: false });
          console.log(error);
        },
        { //arguments
          enableHighAccuracy: this.state.highAccuracy,
          timeout: this.state.timeoute,
          maximumAge: this.state.maxAge,
          distanceFilter: this.state.dFilter,
          forceRequestLocation: this.state.forceLocation,
        },
      );
    });
  };
  getLocationUpdates = async () => {
    /*creates async thread that continuously tracks user location
      until removeLocationUpdates is called

      this is paused when user minimizes the app
    */
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return; //do nothing if user denies location permission
    }

    this.setState({ updatesEnabled: true }, () => {
      this.watchId = Geolocation.watchPosition(
        async (position) => {
          this.setState({ location: position,  latitude: position.coords.latitude,  longitude: position.coords.longitude, speed: position.coords.speed, timestamp: position.timestamp });
          console.log(position);
          await this.getCounty();

          //sends location data to database
          this.context.uploadUserLocation(this.state.location, this.state.county);
          this.context.setUserLocationInfo(this.state.location);

        },
        (error) => {
          console.log(error);
        },
        { //parameters for watchPosition
          enableHighAccuracy: this.state.highAccuracy,
          distanceFilter: this.state.dFilter,
          timeout: this.state.timeoute,
          maximumAge: this.state.maxAge,
          interval: this.state.interv,
          fastestInterval: this.state.fInterval,
          forceRequestLocation: this.state.forceLocation,
          showLocationDialog: this.state.showLocationDialog,
          useSignificantChanges: this.state.significantChanges,
        },
      );
    });
  };

  removeLocationUpdates = () => {
    //stops tracking user location
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.setState({ updatesEnabled: false });
    }
  };
 
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
