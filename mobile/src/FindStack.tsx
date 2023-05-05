import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import FindScreen from './FindScreen';
import ItemScreen from './ItemScreen';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator initialRouteName="Find" headerMode="none">
      <Stack.Screen name="Find" component={FindScreen} />
      <Stack.Screen name="Item" component={ItemScreen} />
    </Stack.Navigator>
  );
};
