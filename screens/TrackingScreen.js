/**Raymond Wu
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
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
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Geolocation from 'react-native-geolocation-service';
import { AuthContext } from '../navigation/AuthProvider';


export default class Tracking extends Component<{}> {

  watchId = null;

  state = {
		forceLocation: true,
    highAccuracy: true,
    loading: false,
    showLocationDialog: true,
    significantChanges: false,
    updatesEnabled: false,
    foregroundService: false,
    timeoute: 15000,
    maxAge: 10000,
    dFilter: 0,
    interv: 5000,
    fInterval: 2000,
    location: {},
  };

  componentWillUnmount() {
    this.removeLocationUpdates();
  }

  hasLocationPermissionIOS = async () => {
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
    if (Platform.OS === 'ios') {
      const hasPermission = await this.hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
    {return hasPermission;}
  }

   async componentDidMount() {
    if (async () => {
      await this.hasLocationPermission;}) {
      Geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            const location = JSON.stringify(position);

			    	this.setState({ location });
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({ loading: true }, () => {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({ location: position, loading: false });
          console.log(position);
        },
        (error) => {
          this.setState({ loading: false });
          console.log(error);
        },
        {
          enableHighAccuracy: this.state.highAccuracy,
          timeout: this.state.timeoute,
          maximumAge: this.state.maxAge,
          distanceFilter: this.state.dFilter,
          forceRequestLocation: this.state.forceLocation,
          showLocationDialog: this.state.showLocationDialog,
        },
      );
    });
  };

  getLocationUpdates = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    if (Platform.OS === 'android' && this.state.foregroundService) {
      await this.startForegroundService();
    }

    this.setState({ updatesEnabled: true }, () => {
      this.watchId = Geolocation.watchPosition(
        (position) => {
          this.setState({ location: position });
          console.log(position);
        },
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: this.state.highAccuracy,
          distanceFilter: this.state.dFilter,
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
    if (this.watchId !== null) {
      this.stopForegroundService();
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.setState({ updatesEnabled: false });
    }
  };

  startForegroundService = async () => {
    if (Platform.Version >= 26) {
      await VIForegroundService.createNotificationChannel({
        id: 'locationChannel',
        name: 'Location Tracking Channel',
        description: 'Tracks location of user',
        enableVibration: false,
      });
    }

    return VIForegroundService.startService({
      channelId: 'locationChannel',
      id: 420,
      title: appConfig.displayName,
      text: 'Tracking location updates',
      icon: 'ic_launcher',
    });
  };

  stopForegroundService = () => {
    if (this.state.foregroundService) {
      VIForegroundService.stopService().catch((err) => err);
    }
  };

  setAccuracy = (value) => this.setState({ highAccuracy: value });
  setSignificantChange = (value) =>
    this.setState({ significantChanges: value });
  setLocationDialog = (value) => this.setState({ showLocationDialog: value });
  setForceLocation = (value) => this.setState({ forceLocation: value });
  setForegroundService = (value) => this.setState({ foregroundService: value });

  render() {
    const {
      forceLocation,
      highAccuracy,
      loading,
      location,
      showLocationDialog,
      significantChanges,
      updatesEnabled,
      foregroundService,
    } = this.state;
    this.hasLocationPermission();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style = {styles.body}>
      <Button onPress = {this.getLocationUpdates} title= "Get location updates"/>
      <Button onPress = {this.removeLocationUpdates} title= "Remove location Updates"/>





      <TouchableOpacity onPress = {this.getLocation} >
					<Text style={styles.welcome}>Find My Coords?</Text>
					<Text>Latitude: {location?.coords?.latitude || ''}</Text>
            <Text>Longitude: {location?.coords?.longitude || ''}</Text>
            <Text>Heading: {location?.coords?.heading}</Text>
            <Text>Accuracy: {location?.coords?.accuracy}</Text>
            <Text>Altitude: {location?.coords?.altitude}</Text>
            <Text>Speed: {location?.coords?.speed}</Text>
            <Text>
              Timestamp:{' '}
              {location.timestamp
                ? new Date(location.timestamp).toLocaleString()
                : ''}
            </Text>
				</TouchableOpacity>
      </SafeAreaView>
    </>
  );
}
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.lighter,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10
	}
});

