import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CloudSyncScreen from '../screens/CloudSyncScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let icon;
          if (route.name === 'Notes') {
            icon = require('../assets/home.png');
          } else if (route.name === 'Favorites') {
            icon = require('../assets/heart.png');
          } else if (route.name === 'Cloud') {
            icon = require('../assets/cloud.png');
          }
          return (
            <Image
              source={icon}
              style={[
                styles.icon,
                { tintColor: focused ? '#4CAF50' : '#9ca3af' },
              ]}
            />
          );
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { backgroundColor: '#fff', elevation: 8 },
        headerShown: false,
      })}>
      <Tab.Screen name="Notes" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Cloud" component={CloudSyncScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default TabNavigator;