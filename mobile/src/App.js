import 'react-native-gesture-handler';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import ScheduleStack from './ScheduleStack';
import AboutScreen from './AboutScreen';
import FeedbackScreen from './FeedbackScreen';
import RemindersScreen from './RemindersScreen';
import FindStack from './FindStack';
import Onboarding from './components/app/Onboarding';

const Drawer = createDrawerNavigator();

export default function App () {
  return (
    <>
      <StatusBar />
      <NavigationContainer>
        <Drawer.Navigator initialRouteName='Collection Reminder'>
          <Drawer.Screen name='Bin Schedule' component={ScheduleStack} />
          <Drawer.Screen name='Which bin does this go in?' component={FindStack} />
          <Drawer.Screen name='Feedback' component={FeedbackScreen} />
          <Drawer.Screen name='Collection Reminder' component={RemindersScreen} options={{ unmountOnBlur: true }} />
          <Drawer.Screen name='About' component={AboutScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
      <Onboarding />
    </>
  );
}
