import React , { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ResourceScreen from '../screens/ResourceScreen';
import TrackingScreen from "../screens/TrackingScreen";
import Ionicons from 'react-native-vector-icons/Ionicons';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppStack = () => {
    return (
      <Tab.Navigator
        tabBarOptions={{
          style: {
            backgroundColor: 'black'
          },
          activeTintColor: '#2e64e5',
          labelStyle: {
            fontSize: 9,
            color: '#a6e4d0',
            fontWeight: 'bold'

        },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: () => (
              <Ionicons name="home-sharp" color="#a6e4d0" size={24} />),
          }}
        />
        <Tab.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{
          tabBarLabel: 'Tracking',
          tabBarIcon: () => (
            <Ionicons name="navigate-sharp" color="#a6e4d0" size={24} />),
        }}
      />
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            tabBarLabel: 'Map',
            tabBarIcon: () => (
              <Ionicons name="map-sharp" color="#a6e4d0" size={24} />),
          }}
        />
      </Tab.Navigator>
    );
  }
  
  export default AppStack;