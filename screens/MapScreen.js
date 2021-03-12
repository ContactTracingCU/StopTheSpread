import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Text,
  PermissionsAndroid,
  Button,
} from "react-native";
import MapView, {
  Heatmap,
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polygon,
} from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { AuthContext } from "../navigation/AuthProvider";
import auth from "@react-native-firebase/auth";
import { firebase } from "@react-native-firebase/database";
import ProgressButton from "../components/ProgressButton";
const db = firebase.app().database("https://sts0-76694.firebaseio.com");

export default class HeatMap extends Component {
  static contextType = AuthContext;
  watchId = null; //number

  loop = () => {
    if (this.state.lock) {
      return; //don't run this function twice
    }
    else{
      this.state.lock = true;
    }
    if (this.context.isEnabled && !this.state.updatesEnabled) {
      console.log("get location updates");
      this.getLocationUpdates();
    } else if (!this.context.isEnabled && this.watchId != null) {
      console.log("remove location updates");
      this.removeLocationUpdates();
    }
    this.setState({lock: false}); //unlock 
  };

  mainLoop = async () => {
    mloop = setInterval(this.loop, 5000);
  };

  hasLocationPermissionIOS = async () => {
    // asks for location permission on iOS

    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert("Unable to open settings");
      });
    };
    const status = await Geolocation.requestAuthorization("whenInUse");

    if (status === "granted") {
      return true;
    }

    if (status === "denied") {
      Alert.alert("Location permission denied");
    }

    if (status === "disabled") {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        "",
        [
          { text: "Go to Settings", onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ]
      );
    }

    return false;
  };

  

  hasLocationPermission = async () => {
    //checks if permission has been granted
    if (Platform.OS === "ios") {
      const hasPermission = await this.hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === "android" && Platform.Version < 23) {
      return true;
    }
    const hasPermissionAndroid = await PermissionsAndroid.request(
      // TODO: this won't run, need to debug
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, 
      {
        title: "Location Tracking Permission",
        message:
          "Stop the Spread needs access to your location data " +
          "to know if you've come into contact with anyone infected. ",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    { if (hasPermissionAndroid === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } 
    else {
      console.log("Permission denied")
      return false;
      }//else
    } 
    
  };

  async componentDidMount() {
    //called at the beginning
      this.mainLoop();
  }

  componentWillUnmount() {
    // called when the app terminates
    // stops location tracking
    this.removeLocationUpdates();
    clearInterval(mloop);
  }

  getCounty = async () => {
    // Sets the county variable to what the geocoder api returns.
    //This is too slow so the program will execute the next line of code before this finishes.
    let x;
    fetch(
      "https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=" +
        this.state.longitude +
        "&y=" +
        this.state.latitude +
        "&benchmark=4&vintage=4&format=json"
    )
      .then((response) => response.json())
      .then((json) => {
        x = json.result.geographies.Counties[0].NAME;
        this.setState({ county: x });
        console.log(json.result.geographies.Counties[0].NAME);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
    return x;
  };

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
          this.setState({
            location: position,
            loading: false,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          });
          console.log(position);
          await this.getCounty();
          //sends location data to database
          this.context.uploadUserLocation(
            this.state.location,
            this.state.county
          );
          this.context.setUserLocationInfo(this.state.location);
        },
        (error) => {
          this.setState({ loading: false });
          console.log(error);
        },
        {
          //arguments
          enableHighAccuracy: this.state.highAccuracy,
          timeout: this.state.timeoute,
          maximumAge: this.state.maxAge,
          distanceFilter: this.state.dFilter,
          forceRequestLocation: this.state.forceLocation,
        }
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
    console.log("has location permission");
    this.setState({ updatesEnabled: true }, () => {
      this.watchId = Geolocation.watchPosition(
        async (position) => {
          if (!this.state.updatesEnabled) {
            return; //stops tracking location if removeLocation updates is called
          }
          this.setState({
            location: position,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          });
          console.log(position);
          await this.getCounty();

          //sends location data to database
          this.context.uploadUserLocation(
            this.state.location,
            this.state.county
          );
          this.context.setUserLocationInfo(this.state.location);
        },
        (error) => {
          console.log(error);
        },
        {
          //parameters for watchPosition
          enableHighAccuracy: this.state.highAccuracy,
          distanceFilter: this.state.dFilter,
          timeout: this.state.timeoute,
          maximumAge: this.state.maxAge,
          interval: this.state.interv,
          fastestInterval: this.state.fInterval,
          forceRequestLocation: this.state.forceLocation,
          showLocationDialog: this.state.showLocationDialog,
          useSignificantChanges: this.state.significantChanges,
        }
      );
    });
  };

  removeLocationUpdates = () => {
    //stops tracking user location
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.setState({ updatesEnabled: false });
      console.log("Stopping tracking");
    }
  };

  constructor() {
    super();

    this.state = {
      count: 0,
      mapArr: [{ latitude: -76.299965, longitude: -148.003021, weight: 100 }], //must have initial coords for android (else throws no points error). this is antartica
      markerArr: [],
      initialPosition: {
        latitude: 41.5, //40
        longitude: -100.0, //-74
        latitudeDelta: 50,
        longitudeDelta: 50,
      },
      markerInit: {
        latitude: 39.7453,
        longitude: -105.0007,
      },
      coordsPoly: [
        { name: "coors", latitude: 39.7559, longitude: -104.9942 } /*coors*/,
        {
          name: "elitches",
          latitude: 39.7502,
          longitude: -105.0101,
        } /*elitches*/,
        {
          name: "dt aquarium",
          latitude: 39.7518,
          longitude: -105.0139,
        } /*dt aquarium*/,
        {
          name: "conventionC",
          latitude: 39.7422,
          longitude: -104.9969,
        } /*convention c*/,
        {
          name: "denver skateP",
          latitude: 39.7596,
          longitude: -105.0028,
        } /*denver skateP*/,
        {
          name: "denver beer",
          latitude: 39.7582,
          longitude: -105.0074,
        } /*denver beer*/,
        {
          name: "civic centerP",
          latitude: 39.7365,
          longitude: -104.99,
        } /*civic centerP*/,
      ],
      // variables
      forceLocation: true, //forcefully request location
      highAccuracy: true, //use high accuracy mode for gps
      loading: false, //tracks if app is waiting for location data
      significantChanges: false, //return locations only if device detects significant change (android only)
      updatesEnabled: false, //tracks whether location updates is turned on or not
      timeoute: 15000, //Request timeout
      maxAge: 10000, //store gps data for this many ms
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
      lock: false,
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
    }*/
    }; //this.state
  } //constructor

  static navigationOptions = {
    title: "Denver",
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
    { latitude: 40.0232, longitude: -105.0014, weight: 100}*/
  ];
  getData = () => {
    this.setState({
      mapArr: [{ latitude: -76.299965, longitude: -148.003021, weight: 100 }], ////must have initial coords for android (else throws no points error). this is antartica
    });
    // //mapArr = [];
    // this.setState({ count: this.state.count + 1 });
    db.ref("users")
      .limitToFirst(100)
      .once("value")
      .then((snapshot) => {
        let oVal = snapshot.val();
        console.log("from oVal");
        //console.log( Object.keys(oVal).length, oVal[Object.keys(oVal)[0]]);
        //store object lat, long, weight(convert from infectionStatus) in array
        //each no try-catch; each users must have infectionStatus, locationInfo.lat/long
        try {
          //Object.keys(oVal) - array of uIDs
          //Object.keys(oVal)[i] - referencing uID at index i
          //oVal[Object.keys(oVal)[i]] - value of each uID

          /////
          for (let i = 0; i < Object.keys(oVal).length; i++) {
            let fireObj = oVal[Object.keys(oVal)[i]];
            ///fixed bug where you had to report your location to see others on the map, now you dont have to and can still see others on map
            if (fireObj["locationInfo"] == null) {
              continue;
            }
            //////////////////////////////////
            let uInfectionStatus = fireObj["infectionStatus"];
            let mapWeight;
            ///get user id
            let userID = Object.keys(oVal)[i];
            ///get timestamp, then convert to date
            ////
            //convert infectionStatus into weights
            if (uInfectionStatus == "P") {
              mapWeight = 99;
            } else if (uInfectionStatus == "N") {
              mapWeight = 9;
            } else {
              mapWeight = 60;
            }

            let mapObj = {
              latitude: fireObj["locationInfo"]["lat"],
              longitude: fireObj["locationInfo"]["long"],
              weight: mapWeight,
            };

            let markerObj = {
              latitude: fireObj["locationInfo"]["lat"],
              longitude: fireObj["locationInfo"]["long"],
              infectionStatus: uInfectionStatus,
              uID: userID,
            };

            //check if mapArr contains the same object to avoid rerendering duplicates; only works if weight is not changed, else a new object to mapArr with same coords but differnt weight
            // if (
            //   this.state.mapArr.some(
            //     (e) =>
            //       e.latitude === mapObj.latitude &&
            //       e.longitude === mapObj.longitude &&
            //       e.weight === mapObj.weight
            //   )
            // ) {
            //   /* mapArr contains a duplicate obj */
            //   continue;
            // } else if (
            //   this.state.mapArr.some(
            //     (e, i, t) =>
            //       e.latitude === mapObj.latitude &&
            //       e.longitude === mapObj.longitude &&
            //       e.weight != mapObj.weight
            //   )
            // ) {
            //   this.state.mapArr[i][weight] = mapObj.weight;
            // } else {
            //   //this object retrieved from database is unique compared to objects in mapArr
            //   //this.state.mapArr.push(mapObj);
            //   this.setState({ mapArr: [...this.state.mapArr, mapObj] }); //simple value
            // }
            //this.state.mapArr.push(mapObj);
            this.setState({ mapArr: [...this.state.mapArr, mapObj] }); //simple value
            this.setState({ markerArr: [...this.state.markerArr, markerObj] });
          }
        } catch (e) {
          console.log(e);
        }
      }); //then
    console.log(
      "in getData() and length of mapArr = ",
      this.state.mapArr.length
    ); // prints 1 on first try since this is outside of promise/async function

    ////
    ////this cause to not update on first pressed because we are assigning a non-state points array
    ///the points prop of heatmap. state changes will rerender but since the change is for a non-state prop,
    ///the screen does not rerender. On the second press, this.setState({'mapArr': []}) is called, which
    ///causes change in state so rerender, thats why you see coordinates show on second press.
    ///
    //this.points = this.state.mapArr;
    //console.log('in points ', this.points);
    ///
    ///
    ///testing global vars
    ///
    //console.log('in mappArr global', mapArr);
    //points = mapArr;
    //console.log(points);
  }; //getData function

  markers = () => {
    return this.points.map((val) => {
      <MapView.Marker
        coordinate={{
          latitude: val.latitude,
          longitude: val.longitude,
        }}
        title={"parking markers"}
      ></MapView.Marker>;
    });
  };

  render() {
    const { user, getUserInfectionStatus, getUsers } = this.context;
    const { location } = this.state;
    this.hasLocationPermission();
    /*if(uInfectionStatus == 'P'){
  mapWeight = 99;
}else if(uInfectionStatus == 'N'){
    mapWeight = 35;
}else if(uInfectionStatus == 'D'){
  mapWeight = 100;
}else{
    mapWeight = 70;*/
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={(map) => (this._map = map)}
          style={styles.map}
          initialRegion={this.state.initialPosition}
          minZoomLevel={0} // default => 0
          maxZoomLevel={14} // default => 20
          loadingEnabled={true}
          loadingIndicatorColor={"#a6e4d0"}
          onRegionChangeComplete={this.getData}
          showsIndoorLevelPicker={true}
        >
          <Heatmap
            points={this.state.mapArr}
            radius={Platform.OS === "ios" ? 40 : 20}
            opacity={1}
            gradient={{
              colors: ["green", "orange", "red"],
              startPoints: [0.05, 0.2, 0.5],
              colorMapSize: 2000,
            }}
          ></Heatmap>
        </MapView>
        {/* <View style={styles.bottomView}>
          <ProgressButton onPress={this.getData} />
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomView: {
    width: "100%",
    height: 50,
    //backgroundColor: '#a6e4d0',
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", //Here is the trick
    bottom: 6.1, //Here is the trick
  },
});
