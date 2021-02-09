import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimensions';
import AwesomeButton from 'react-native-really-awesome-button';

  function Button(props) {
    return (
     <AwesomeButton
        backgroundColor={'#a6e4d0'}
        width={110}
        height={50}
        textSize={24}

       progress
       onPress={(next) => {
         /** Do Something **/
         props.onPress();
         next();
       }}
     >
       Update
     </AwesomeButton>
    );
  }
  export default Button;

  