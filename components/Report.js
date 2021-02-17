import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimensions';

const Report = ({buttonTitle, ...rest}) =>{
    return (
      <TouchableOpacity style={styles.buttonContainer} {...rest}>
          <Text style={styles.buttonText}>{buttonTitle}</Text>
      </TouchableOpacity>
    );
};
export default Report;

const styles = StyleSheet.create({
    buttonContainer: {
      marginTop: 10,
      marginBottom: 5, 
      width: '100%',
      height: windowHeight / 15,
      backgroundColor: '#FF6961',
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 3,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30
    },
    buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ffffff'
    },
  });