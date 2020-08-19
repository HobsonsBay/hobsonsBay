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
  View 
} from 'react-native';
import ScheduleStack from './ScheduleStack';
import Homepage from './Homepage';
import AboutScreen from './AboutScreen';
import Contact from './Contact';
import FeedbackScreen from './FeedbackScreen';
import RemindersScreen from './RemindersScreen';
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


const CustomDrawerContent = (props) => {
  //props.label = CustomText();
  //console.log(props);
  return (
    <DrawerContentScrollView {...props}>
      <View style={{
        flexDirection:"row",
        alignItems:"flex-end",
        //justifyContent:"space-between",
        paddingHorizontal:20,
        paddingTop:10,
      }}>
        <Image style={{
          height: 41,
          width: 150
          // 895 x 719
        }} source={images.recyclingLogoWite} />
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const navComp = (name, options) => {return ({
  drawerLabel:({ focused, color }) => {
    return <Text numberOfLines={2} style={{ color: "#fff", fontSize: 14, fontWeight: 'bold' }}>{name}</Text>
  },
  ...options
})}


export default function App (props) {
  
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
        <Drawer.Navigator drawerStyle={{backgroundColor: '#1352A5'}} drawerPosition="right" drawerContent={props => <DrawerContent {...props} />} initialRouteName='Home'>
          <Drawer.Screen options={navComp('Home')} name='Home' component={Homepage}/>
          <Drawer.Screen options={navComp('Bin Schedule')} name='Bin Schedule' component={ScheduleStack}/>
          <Drawer.Screen options={navComp('Which bin does\nthis go in?')} name='Which bin' component={FindStack} />
          <Drawer.Screen options={navComp('Reminder',{unmountOnBlur: true})} name='Collection Reminder' component={RemindersScreen}/>
          <Drawer.Screen options={navComp('Feedback')} name='Feedback' component={FeedbackScreen} />
          <Drawer.Screen options={navComp('About')} name='About' component={AboutScreen} />
          <Drawer.Screen options={navComp('Contact')} name='Contact' component={Contact} />
        </Drawer.Navigator>
      </NavigationContainer>
      <Onboarding/>
    </AppDataProvider>
    </>
  );
}
