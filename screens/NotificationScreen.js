import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from "react-native";

//custom components
import { AuthContext } from "../navigation/AuthProvider";

// libraries
import ProgressButton from "../components/ProgressButton";
import { FlatList } from "react-native-gesture-handler";

const NotificationScreen = ({}) => {
  const { getUserContacts } = useContext(AuthContext);

  //force rerender
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const reRender = () => {
    forceUpdate();
  };

  getContactLocations = async () => {
    contactLocations = Object.values(getUserContacts());

    return contactLocations;
  };

  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    amOrPm = ""
    if(hour > 12){
        hour = hour - 12;
        var min = a.getMinutes();
        if(String(min).length < 2){
            min = "0" + min;
        }
        amOrPm = " PM";
    }
    else{
        var min = a.getMinutes();
        if(String(min).length < 2){
            min = "0" + min;
        }
        if(hour == 0){
            hour = 12;
        }
        amOrPm = " AM";
    }

    var time =
      month + " " + date + ", " + year;
    return [hour, min, amOrPm, time];
  }

  handleRefresh = () => {
    reRender();
  }
  
  return (
    <View style={styles.container} backgroundColor={"white"}>
      <View>
        <View style={styles.header}>
            <Text style={styles.headerText}>Possible Contacts</Text>
        </View>
        <FlatList
        style={styles.list}
          data={Object.values(getUserContacts())}
          renderItem={({ item }) => (
            <View style={styles.itemView}>
                <Text style={styles.listItems}>&#10071; {timeConverter(Number(item))[3] }</Text>
                <Text style={styles.listHour}>{timeConverter(Number(item))[0] + ":" + timeConverter(Number(item))[1] + timeConverter(Number(item))[2]}</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.updateButton}>
        <ProgressButton
          onPress={() => {
            reRender();
            console.log(Object.values(getUserContacts()));
          }}
        />
      </View>
    </View>
  );
};
export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#f9fafd",
  },
  header: {
    marginTop: 45,
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 25,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 25,
    textAlign: 'left',
    paddingLeft: 10,
    fontFamily: "Helvetica Neue",
    fontWeight: "bold"
  },
  updateButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 6.1,
  },
  list: {
    paddingTop: 5,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  listItems: {
    paddingTop: 10,
    fontSize: 18,
    paddingLeft: 10,
    fontFamily: "Helvetica Neue",
    fontWeight: '500'
  },
  listHour: {
    paddingTop: 5,
    fontSize: 12,
    paddingLeft: 40,
    fontFamily: "Helvetica Neue",
    fontWeight: '500',
    color: 'grey'
  },
  itemView:{
    paddingBottom: 5,
  }
});
