import React, {useState, useContext, useCallback} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Button, SafeAreaView} from 'react-native';

//custom components
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

// button componentes
import Report from '../components/Report';
import ReportNegative from '../components/ReportNegative'
import ReportPositive from '../components/ReportPositive'
import ReportSymptoms from '../components/ReportSymptoms'
import ReportCancel from '../components/ReportCancel'
import GetContacts from '../components/GetContacts'

// bottom sheet libraries
//    used for animations but not used at the moment
import Animated from 'react-native-reanimated'; 
import BottomSheet from 'reanimated-bottom-sheet';
import ProgressButton from '../components/ProgressButton';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { WebView } from 'react-native-webview';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/database';
import AwesomeButton from 'react-native-really-awesome-button';

let iStatus = '';// must have variable globally if wished to use to store return values from firebase

const HomeScreen = ({navigation}) =>{
  
  const {user, logout, setUserInfectionStatus, getUserInfectionStatus, getUserContacts} = useContext(AuthContext);
  const sheetRef = React.useRef(null);

  //added state management using hooks
  const [infectStatus , setInfectStatus] = useState('Click on report to update');

  //force rerender
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const clickHandler = (s) =>{
    setInfectStatus(s);
  };

  const reRender = () => {
    forceUpdate();
  }

  const getUStat = () => {
    const db = firebase.app().database('https://sts0-76694.firebaseio.com');
    db.ref('users/' + user.uid + '/infectionStatus').on('value', snapshot => {
      iStatus = snapshot.val();
    });
    console.log('in getUstat', iStatus);
    return iStatus;
  }


  // set up render content for bottom sheet
  const renderContent = () => (
      <View
        style={{
          backgroundColor: '#DEDEDE',
          paddingLeft: 50,
          paddingRight: 50,
          height: 450,
          alignItems: "center"
        }}
      >
        {/* bottom sheet content */}
        <Text style = {styles.grabber} > &#10134; </Text>
    
        <ReportNegative
          buttonTitle='Negative'
          onPress={() =>{sheetRef.current.snapTo(0); clickHandler('Negative'); return setUserInfectionStatus('N')}} />
    
        <ReportSymptoms
          buttonTitle='Symptoms'
          onPress={() =>{sheetRef.current.snapTo(0); clickHandler('Symptomatic'); return setUserInfectionStatus('M')}} />
    
        <ReportPositive
          buttonTitle='Positive'
          onPress={() =>{sheetRef.current.snapTo(0); clickHandler('Positive'); return setUserInfectionStatus('P');}} />

        <ReportCancel
                  buttonTitle='cancel'
                  onPress={() =>{sheetRef.current.snapTo(0);}} />
      </View>
    );

    // had to move id and infenction status to make room for buttons
    return (
      
      <View style={styles.container} backgroundColor={'#a6e4d0'} >
        <View style={styles.webView}>
            <SafeAreaView style={styles.webView2}>
                <WebView
                    source={{ uri: 'https://www.cdc.gov/coronavirus/2019-ncov' }}
                />
            </SafeAreaView>

        </View>
        <View style={styles.buttonShow}>
          <Button title={'Show more'}  onPress={() => this._panel.show()} />
           
        </View>
          <SlidingUpPanel ref={c => this._panel = c} >
            <SafeAreaView style={styles.bSheet}>
          <View style={styles.positiveContacts}>
            <Text>{'Positive Contacts: ' + getUserContacts()}</Text>
            <Text>{'Infection status from Firebase: ' + getUStat()}</Text>
          </View>
          <View style={styles.top}>
              <Text style={styles.text}>Hello User:</Text>
              <Text style={{color: '#a6e4d0',fontSize:18, textAlign: 'center', fontFamily: 'Iowan Old Style'}}>{user.uid}</Text>
          </View>
          <View style={styles.middle}>
              <Text style={styles.text}>Directions:</Text>
              <Text style={{color: '#a6e4d0',fontSize:18, textAlign: 'center', fontFamily: 'Iowan Old Style'}}>1) Report your infection status (To stay anonymous, report Negative)</Text>
              <Text style={{color: '#a6e4d0',fontSize:18, textAlign: 'center', fontFamily: 'Iowan Old Style'}}>2) Navigate to Tracking, press Start Tracking</Text>
          </View>
          <View style={styles.bottom}>
              <Text style={{color: 'white',fontSize:18, fontWeight: 'bold', fontFamily: 'Iowan Old Style'}}>Your infection status:</Text>
              <Text style={{color: '#a6e4d0',fontSize:18, textAlign: 'center', fontFamily: 'Iowan Old Style'}}>{infectStatus}</Text>
              
          </View>
          <View style={styles.bottomHide}>
            <Button title='Hide' onPress={() => this._panel.hide()} />
          </View>
          <View style={styles.fetch}>
            <ProgressButton onPress={() => {reRender()}}/>
          </View>
         
          
          <View style={styles.buttons}> 
            {/* <GetContacts
            buttonTitle = 'Get Positive Contacts'
            onPress = {() => {}}/> */}

            <Report
              buttonTitle = 'Report'
              // on press snap to position in snapPoins list 
              onPress = {() => sheetRef.current.snapTo(1)} />

            <FormButton 
              buttonTitle='Logout'
              onPress={() => {return logout()}} />
          </View>

          {/* initialize bottom sheet */}
          
          </SafeAreaView>
          </SlidingUpPanel>
          <BottomSheet
            ref={sheetRef}
            snapPoints={[0, 470]}
            borderRadius={10}
            renderContent={renderContent} />
        
        
      </View>
    );
};
export default HomeScreen;

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f9fafd',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      
    },
    logo: {
      height: 150,
      width: 150,
      resizeMode: 'cover',
    },
    text: {
      fontSize: 35,
      marginBottom: 5,
      //color: '#051d5f',
      color: 'white',
      fontFamily: 'Iowan Old Style',
      marginTop: 0
    },
    navButton: {
      marginTop: 15,
    },
    forgotButton: {
      marginVertical: 35,
    },
    navButtonText: {
      fontSize: 18,
      fontWeight: '500',
      color: '#2e64e5'
    },
    bottomView: {
      width: '100%',
      height: 50,
      backgroundColor: '#EE5407',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 60

    },
    grabber:{
      fontSize: 30
    },
    buttons:{
      width: '100%',
      bottom: -750
    },
    positiveContacts:{
      backgroundColor : 'yellow',
      //top: -140,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      height: 35,
      position: 'absolute', //Here is the trick
      top:120
    },
    top: {
      flex: .1,
      backgroundColor: "black",
      borderColor: 'grey',
      borderWidth: 7,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 120,
      padding: 15,
      margin: 40,
      width: 350
      
      
    },
    middle: {
      flex: 0.3,
      backgroundColor: "black",
      borderWidth: 7,
      borderColor: 'grey',
      justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 250,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      padding: 15,
      margin: 40,
      width: 350
      
    },
    bottom: {
      flex: 0.3,
      backgroundColor: "black",
      borderColor: 'grey',
      borderWidth: 7,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 433,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      margin: 60,
      padding: 10,
      width: 300
    },
    bottomHide: {
      
      justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 540,
      backgroundColor: "black",
      borderColor: 'grey',
      borderWidth: 6,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      margin: 170,
      width: 70,
      height: 50,
      
    },
    buttonShow: {
      marginTop: 0,
      backgroundColor: '#a6e4d0',
      borderColor: 'grey',
      borderWidth: 6,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 40,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      width: 400,
      
      
    },
    buttonShow2: {
      color: '#a6e4d0',
      
    },

    webView : {
      width: 100,
      flex: 1
      
      
    },
    webView2 : {
      top: 261,
      width: 100,
      flex: 9,
      width: 440,
      margin: -166,
    },
    bSheet : {
      top: -15,
      width: 100,
      flex: 9,
      width: 400,
      margin: 15,
      justifyContent: 'center', alignItems: 'center', position: 'absolute', 
      bottom: 800,
    },

    fetch :{
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      top: 600,
      backgroundColor: 'grey',
      justifyContent: 'center', alignItems: 'center', position: 'absolute',
      backgroundColor: "#a6e4d0",
      borderColor: 'grey',
      borderWidth: 1,
      width: 400,
      height: 60,
      padding: 1,

    }
    


  });
  
