import React, { useState, useContext, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

//custom components
import FormButton from "../components/FormButton";
import { AuthContext } from "../navigation/AuthProvider";

// button componentes
import Report from "../components/Report";
import ReportNegative from "../components/ReportNegative";
import ReportPositive from "../components/ReportPositive";
import ReportSymptoms from "../components/ReportSymptoms";

// bottom sheet libraries
//    used for animations but not used at the moment
import BottomSheet from "reanimated-bottom-sheet";
import SlidingUpPanel from "rn-sliding-up-panel";
import { WebView } from "react-native-webview";
import SettingsButton from "../components/SettingsButton";
import { Switch } from "react-native-gesture-handler";

let iStatus = ""; // must have variable globally(only works for fucntional component) if wished to use to store return values from firebase

const HomeScreen = ({ navigation }) => {
  const {
    logout,
    setUserInfectionStatus,
    isEnabled,
    toggleSwitch,
  } = useContext(AuthContext);
  const sheetRef = React.useRef(null);

  //force rerender
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  // set up to hide settings button
  // const [shouldShow, setShouldShow] = useState(true);

  // set up to get state of switch
  //const [isEnabled, setIsEnabled] = useState(false);
  //const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const clickHandler = (s) => {
    setCount(s);
  };

  const [firstRender, setFirstRender] = useState(false);
  let re = false;
  // //same as component did mount
  // useEffect(() => {
  //   setFirstRender(true);
  // }, []);

  // set up render content for bottom sheet
  const renderContent = () => (
    <View
      style={{
        backgroundColor: "#DEDEDE",
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 20,
        height: 450,
        alignItems: "center",
      }}
    >
      {/* bottom sheet content */}
      <ReportNegative
        buttonTitle="Negative/No Symptoms"
        onPress={() => {
          sheetRef.current.snapTo(0);
          //clickHandler("Negative");
          return setUserInfectionStatus("N");
        }}
      />

      <ReportSymptoms
        buttonTitle="Symptoms"
        onPress={() => {
          sheetRef.current.snapTo(0);
          //clickHandler("Symptomatic");
          return setUserInfectionStatus("M");
        }}
      />

      <ReportPositive
        buttonTitle="Positive"
        onPress={() => {
          sheetRef.current.snapTo(0);
          //clickHandler("Positive");
          return setUserInfectionStatus("P");
        }}
      />
      <Text style={styles.reportFooter}>
        Reporting is not necesary but does help the contact tracing accuracy
      </Text>
    </View>
  );
  return (
    <View style={styles.container} backgroundColor={"white"}>
      <View style={styles.webView}>
        <SafeAreaView style={styles.webView2}>
          <WebView
            source={{ uri: "https://www.cdc.gov/coronavirus/2019-ncov" }}
          />
        </SafeAreaView>
      </View>

      <View style={styles.settingsButton}>
        <SettingsButton
          buttonTitle="Settings"
          onPress={() => {
            if(!firstRender){
              setFirstRender(true);
              return
            }
            try {
              this._panel.show();
            } catch (e) {
              console.log(e);
            }

            // setShouldShow(!shouldShow);
          }}
        />
      </View>

      {firstRender && (
        <SlidingUpPanel
          ref={(c) => (this._panel = c)}
          allowDragging={false}
          backdropStyle={styles.backdropStyle}
          onBottomReached={() => {
            // setShouldShow(!shouldShow);
            sheetRef.current.snapTo(0);
          }}
        >
          <View
            style={styles.container}
            onStartShouldSetResponder={() => this._panel.hide()}
          >
            <View style={styles.toggleLocationView}>
              <Text style={styles.toggleLocationText}>Location Services</Text>
              <Switch
                style={styles.toggleLocationSwitch}
                trackColor={{ false: "#767577", true: "#a6e4d0" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
            <View style={styles.buttons}>
              <Report
                buttonTitle="Report"
                // on press snap to position in snapPoins list
                onPress={() => sheetRef.current.snapTo(1)}
              />

              <FormButton
                buttonTitle="Logout"
                onPress={() => {
                  return logout();
                }}
              />
            </View>
          </View>
        </SlidingUpPanel>
      )}

      <BottomSheet
        ref={sheetRef}
        snapPoints={[0, 500]}
        borderRadius={30}
        renderContent={renderContent}
      />
    </View>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 35,
    marginBottom: 5,
    color: "white",
    fontFamily: "Iowan Old Style",
    marginTop: 0,
  },
  buttons: {
    width: "90%",
    position: "absolute",
    bottom: 15,
  },
  webView: {
    width: 100,
    flex: 1,
  },
  webView2: {
    top: 160,
    width: 100,
    flex: 9,
    width: 440,
    margin: -166,
  },
  toggleLocationView: {
    marginLeft: "-80%",
    bottom: 250,
  },
  toggleLocationText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 25,
    position: "absolute",
    // opacity: 1,
  },
  toggleLocationSwitch: {
    marginLeft: "35%",
    position: "absolute",
  },
  settingsButton: {
    paddingBottom: 20,
    width: "50%",
  },
  reportFooter: {
    paddingTop: 10,
    fontFamily: "Helvetica Neue",
    textAlign: "center",
    color: "grey",
  },
  backdropStyle: {
    // backgroundColor: "orange",
  },
});
