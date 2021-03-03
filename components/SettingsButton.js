import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimensions';

const SettingsButton = ({onPress, buttonTitle, ...rest}) =>{
    return (
      <TouchableOpacity onPress={()=> onPress()} style={styles.buttonContainer} {...rest}>
          <Text style={styles.buttonText}>{buttonTitle}</Text>
      </TouchableOpacity>
    );
};
export default SettingsButton;

const styles = StyleSheet.create({
    buttonContainer: {
      marginTop: 10,
      height: windowHeight / 15,
      backgroundColor: '#a6e4d0',
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30
    },
    buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ffffff',
      fontFamily: 'Helvetica Neue'
    },
  });