import React , { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ResourceScreen from '../screens/ResourceScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppStack = () => {
    return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#2e64e5',
          labelStyle: {
            fontSize: 20,
        },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />
        <Tab.Screen
          name="Map"
          component={MapScreen}
        />
        <Tab.Screen
          name="Resource"
          component={ResourceScreen}
        />
      </Tab.Navigator>
    );
  }
  
  export default AppStack;