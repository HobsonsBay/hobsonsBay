import 'react-native-gesture-handler';
import React from 'react';
import { createDrawerNavigator, 
  DrawerContentScrollView, 
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, 
  Text, 
  Image,
  View,
  TextInput,
  Linking
} from 'react-native';
import ScheduleStack from './ScheduleStack';
import Homepage from './Homepage';
import AboutScreen from './AboutScreen';
import Contact from './Contact';
import FeedbackScreen from './FeedbackScreen';
import RemindersScreen from './RemindersScreen';
import Newsfeed from './Newsfeed';
import Quiz from './Quiz';
import FindStack from './FindStack';
import Onboarding from './components/app/Onboarding';
import Notifications from './utils/Notifications.js';
import messaging from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-community/async-storage';
import images from './utils/images';
import {AppDataProvider, useData} from './utils/DataContext'
import SplashScreen from 'react-native-splash-screen'
import DrawerContent from './components/navigation/DrawerContent';


Text.defaultProps = {
  ...Text.defaultProps,
  maxFontSizeMultiplier: 1.1,
};

TextInput.defaultProps = {
  ...TextInput.defaultProps,
  maxFontSizeMultiplier: 1.1,
};


const setNotification = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('notification', jsonValue)
  } catch(e) {
    // save error
  }
  console.log('Done.')
}


if (Platform.OS === "android"){
  // Register background handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    setNotification(remoteMessage)
  });
}

const Drawer = createDrawerNavigator();

export default function App (props) {

  // React.useEffect(()=>{
  //   if (Platform.OS === 'android') {
  //     Linking.getInitialURL().then(url => {
  //       this.navigate(url);
  //     });
  //   } else {
  //     Linking.addEventListener('url', this.handleOpenURL);
  //   }
  // })

  // const handleOpenURL = (event) => {
  //   console.log(event.url);
  //   const route = e.url.replace(/.*?:\/\//g, '');
  //   // do something with the url, in our case navigate(route)
  // }
  
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  React.useEffect(() => {
    // do stuff while splash screen is shown
      // After having done stuff (such as async tasks) hide the splash screen
      SplashScreen.hide();
  })

  return (
    <>
    <AppDataProvider>
      <StatusBar />
      <Notifications/>
      <NavigationContainer 
        ref={navigationRef}
        onReady={() => routeNameRef.current = navigationRef.current.getCurrentRoute().name}
        onStateChange={state => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;
          if (previousRouteName !== currentRouteName) {
            analytics().setCurrentScreen(currentRouteName, currentRouteName);
          }
        }} >
        <Drawer.Navigator initialRouteName='Quiz' drawerStyle={{backgroundColor: '#1352A5'}} drawerPosition="right" drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen name='Home' component={Homepage}/>
          <Drawer.Screen name='Bin Schedule' component={ScheduleStack}/>
          <Drawer.Screen name='Newsfeed' component={Newsfeed}/>
          <Drawer.Screen name='Quiz' component={Quiz}/>
          <Drawer.Screen name='Which bin' component={FindStack} />
          <Drawer.Screen options={{unmountOnBlur: true}} name='Collection Reminder' component={RemindersScreen}/>
          <Drawer.Screen name='Feedback' component={FeedbackScreen} />
          <Drawer.Screen name='About' component={AboutScreen} />
          <Drawer.Screen name='Contact' component={Contact} />
        </Drawer.Navigator>
      </NavigationContainer>
      <Onboarding/>
    </AppDataProvider>
    </>
  );
}
