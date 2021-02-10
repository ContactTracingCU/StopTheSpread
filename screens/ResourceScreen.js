import React, {useState, useContext} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
//custom components
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

//'https://coronavirus.jhu.edu/us-map'
const ResourceScreen = ({navigation}) =>{
    const {user, logout, getUserInfectionStatus} = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.descriptionContainerVer}>
                <WebView
                    source={{ uri: 'https://www.cdc.gov/coronavirus/2019-ncov' }}
                />
                <View style={styles.bottomView}>
                    <Text>{getUserInfectionStatus()}</Text>
                </View>
            </SafeAreaView>

        </View>

    );
};
export default ResourceScreen;

const styles = StyleSheet.create({
    container:{
          flex:1,
      flexDirection:'column',
          justifyContent: 'flex-start',
          backgroundColor: 'grey'
      },
      descriptionContainerVer:{
      flex:9, //height (according to its parent)
      //flexDirection: 'column', //its children will be in a row
      //alignItems: 'center',
      // alignSelf: 'center',
    },
    descriptionContainerVer2:{
      flex:1, //height (according to its parent)
      flexDirection: 'column', //its children will be in a row
      alignItems: 'center',
      backgroundColor: 'gray',
      // alignSelf: 'center',
    },
    descriptionContainerHor:{
      //width: 200, //I DON\'T want this line here, because I need to support many screen sizes
      flex: 0.3,  //width (according to its parent)
      flexDirection: 'column',    //its children will be in a column
      alignItems: 'center', //align items according to this parent (like setting self align on each item)
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    descriptionText: {
      backgroundColor: 'green',//Colors.transparentColor,
      fontSize: 16,
      color: 'white',
      textAlign: 'center',
      flexWrap: 'wrap'
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
  
