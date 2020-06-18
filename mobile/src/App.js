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
import Notifications from './utils/Notifications.js';
import messaging from '@react-native-firebase/messaging';


// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

const Drawer = createDrawerNavigator();

export default function App () {
  return (
    <>
      <StatusBar />
      <Notifications/>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName='Bin Schedule'>
          <Drawer.Screen name='Bin Schedule' component={ScheduleStack} />
          <Drawer.Screen name='Which bin does this go in?' component={FindStack} />
          <Drawer.Screen name='Collection Reminder' component={RemindersScreen} options={{ unmountOnBlur: true }} />
          <Drawer.Screen name='Feedback' component={FeedbackScreen} />
          <Drawer.Screen name='About' component={AboutScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
      <Onboarding />
    </>
  );
}
