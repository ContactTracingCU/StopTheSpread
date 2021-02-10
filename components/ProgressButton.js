import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimensions';
import AwesomeButton from 'react-native-really-awesome-button';

  function Button(props) {
    return (
     <AwesomeButton
        backgroundColor={'#a6e4d0'}
        width={430}
        height={65}
        textSize={24}
        textColor={'black'}
        textFamily={'Iowan Old Style'}

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

  