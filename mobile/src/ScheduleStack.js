import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddressScreen from './AddressScreen';
import ScheduleScreen from './ScheduleScreen';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator initialRouteName='Address' headerMode='none'>
      <Stack.Screen name='Address' component={AddressScreen} />
      <Stack.Screen name='Schedule' component={ScheduleScreen} />
    </Stack.Navigator>
  );
};
