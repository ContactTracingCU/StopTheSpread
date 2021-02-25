/**Raymond Wu
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Button,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import Geolocation from 'react-native-geolocation-service';
import { AuthContext } from '../navigation/AuthProvider';


export default class Tracking extends Component {
  
  
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
        // when the user first opens this screen get the location
      Geolocation.getCurrentPosition(
          async(position) => {
            console.log(position);
            
            //saves current location so app can display it on screen
            this.setState({ location: position, latitude: position.coords.latitude,  longitude: position.coords.longitude, speed: position.coords.speed, timestamp: position.timestamp });
            await this.getCounty();
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
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

  render() {
    const {
      location,
    } = this.state;
    this.hasLocationPermission();

  return (
    // This section describes elements that the user sees
    // Comments can't be put between tags
    
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style = {styles.body}>
      <Button onPress = {this.getLocationUpdates} title= "Start Tracking"/>
      <Button onPress = {this.removeLocationUpdates} title= "Stop Tracking"/>





      <TouchableOpacity onPress = {this.getLocation} >
					<Text style={styles.welcome}>Find My Coords?</Text>
					<Text>Latitude: {this.state.latitude || ''}</Text>
            <Text>Longitude: {this.state.longitude || ''}</Text>
            <Text>Heading: {location?.coords?.heading}</Text>
            <Text>Accuracy: {location?.coords?.accuracy}</Text>
            <Text>Altitude: {location?.coords?.altitude}</Text>
            <Text>Speed: {this.state.speed}</Text>
            <Text>
              Timestamp:{' '}
              {this.state.timestamp
                ? new Date(this.state.timestamp).toLocaleString()
                : ''}
            </Text>
            <Text>County: {this.state.county || ''}</Text>

				</TouchableOpacity>
      </SafeAreaView>
    </>
  );
}
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.lighter,
    flex: 1,
    //center everything along x and y 
    justifyContent: "center",
    alignItems: "center"
  },
  welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10
	}
});

