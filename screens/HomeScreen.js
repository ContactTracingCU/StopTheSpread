import React, {useState, useContext} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

//custom components
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

// button componentes
import Report from '../components/Report';
import ReportNegative from '../components/ReportNegative'
import ReportPositive from '../components/ReportPositive'
import ReportSymptoms from '../components/ReportSymptoms'

// bottom sheet libraries
//    used for animations but not used at the moment
import Animated from 'react-native-reanimated'; 
import BottomSheet from 'reanimated-bottom-sheet';


const HomeScreen = ({navigation}) =>{
  const {user, logout, setUserInfectionStatus, getUserInfectionStatus} = useContext(AuthContext);
  const sheetRef = React.useRef(null);

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
        <Text style = {styles.grabber} > &or; </Text>
    
        <ReportNegative
          buttonTitle='Negative'
          onPress={() =>{sheetRef.current.snapTo(0);  return setUserInfectionStatus('N')}} />
    
        <ReportSymptoms
          buttonTitle='Symptoms'
          onPress={() =>{sheetRef.current.snapTo(0);  return setUserInfectionStatus('M')}} />
    
        <ReportPositive
          buttonTitle='Positive'
          onPress={() =>{sheetRef.current.snapTo(0); return setUserInfectionStatus('P');}} />
      </View>
    );

    // had to move id and infenction status to make room for buttons
    return (
        <View style={styles.container}>
          <View style={styles.bottomView}>
            <Text>{user.uid}</Text>
            <Text>{'Infection Status: ' + getUserInfectionStatus()}</Text>
          </View>

          <View style={styles.buttons}> 
            <Report
              buttonTitle = 'Report'
              // on press snap to position in snapPoins list 
              onPress = {() => sheetRef.current.snapTo(1)} />

            <FormButton 
              buttonTitle='Logout'
              onPress={() => {return logout()}} />
            </View>

          {/* initialize bottom sheet */}
          <BottomSheet
            ref={sheetRef}
            snapPoints={[0, 450]}
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
      padding: 20,
    },
    logo: {
      height: 150,
      width: 150,
      resizeMode: 'cover',
    },
    text: {
      fontSize: 28,
      marginBottom: 10,
      color: '#051d5f',
      marginVertical: 35
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
      bottom: -300
    }
  });
  
