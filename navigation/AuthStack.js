import React , { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
//custom components
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

//create stack navigator object
const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator headerMode='none'>
            <Stack.Screen name='Onboarding' component={OnboardingScreen}/>
            <Stack.Screen name='Login' component={LoginScreen}/>
            <Stack.Screen name='SignUp' component={SignUpScreen}/>
        </Stack.Navigator>
      );

}

export default AuthStack;