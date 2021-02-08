import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimensions';

const ReportNegative = ({onPress, buttonTitle, ...rest}) =>{
    return (
      <TouchableOpacity onPress={()=> onPress()} style={styles.buttonContainer} {...rest}>
          <Text style={styles.buttonText}>{buttonTitle}</Text>
      </TouchableOpacity>
    );
};
export default ReportNegative;

const styles = StyleSheet.create({
    buttonContainer: {
      marginTop: 10,
      width: '100%',
      height: windowHeight / 15,
      backgroundColor: 'green',
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 3,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ffffff'
    },
  });