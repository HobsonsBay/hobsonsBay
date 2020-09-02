import React from 'react'
import { hasAddress, clearAddress } from './handleAddress';
import { hasNotification } from './handleNotification';
import fetchDays from '../hooks/fetchDays';
import useFullAddress from '../hooks/useFullAddress';
import { Share } from 'react-native';
import postConfig from '../api/postConfig';
import deleteConfig from '../api/deleteConfig';
import putConfig from '../api/putConfig';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

const DataContext = React.createContext()

function useData() {
  const context = React.useContext(DataContext)
  //console.log(context);
  if (!context) {
    throw new Error(`useData must be used within a AppDataProvider`)
  }
  return context
}

/***************
* provides context (data) to the entire app
*
* covers:
* - notifications
* - addresses
* - bin days
*
**/

function AppDataProvider(props) {
	const [address, setAddress] = React.useState(false);
	const [addressObj, setAddressObj] = React.useState(null);
  const [fullAddress] = useFullAddress();
	const [binDays, setBinDays] = React.useState({area:false,zone:false,day:false,days:false});
	const [config, setConfig] = React.useState(null);
  const [notifications, setNotifications] = React.useState(false);
  const [onboard, setOnboard] = React.useState(true);

  const notificationsOn = async ( type, time ) => {
    /* function to perform the following when reminders are 
    turned on for the first time of after remindersOff has been called:
        - check address is set
        - run firebase requestPermission function
        - call API postConfig function
        - update asyncstorage with returned values for config
        - update setconfig with returned values
    */
    const { day, area } = binDays;
    const zone = `${day} Area ${area}`;
    console.log(config)
    console.log(notifications)
    console.log(hasNotification())
    console.log('start')
    const status = await messaging().requestPermission()
          .then((res) => {
            //console.log('promise chain fbperm')
            return messaging().getToken()
          }).then(token => {
            //console.log('promise chain fbtoken')
            //console.log(token);
            return postConfig({ token, zone, time, ...type });
          }).then((config) => {
            //console.log('promise chain postconf')
            return Promise.all([config, AsyncStorage.setItem('config', JSON.stringify(config))]);
          }).then(([config]) => {
            //console.log('promise chain asyncconf')
            setConfig(config);
            setNotifications(true);
            return true;
          }).catch((err)=>{
            //console.log('promise chain broken')
            return Promise.reject(err)
          });

    return status
  }

  const notificationsOff = async () => {
    /* function to turn off reminders by performing the following:
        - call API deleteConfig function
        - update asyncstorage with null values for config
        - update setconfig with null values
    */
    const { id } = config;

    const status = deleteConfig(id)
      .then(() => {
        return AsyncStorage.removeItem('config');
      }).then(() => {
        setConfig(null);
        setNotifications(false);
        return false
      }).catch((err)=>{
        return Promise.reject(err)
      });

    return status
  }

  const notificationsChange = async ( type, time ) => {
    /* function to update reminder settings by performing the following:
        - call API putConfig function
        - update asyncstorage with returned values for config
        - update setconfig with returned values
    */    
    const updateConfig = {...config, ...type, time};
    const status = putConfig(config.id, updateConfig)
      .then((config) => {
        return Promise.all([config, AsyncStorage.setItem('config', JSON.stringify(config))]);
      }).then(([config]) => { 
        setConfig(config);
        return config
      }).catch((err)=>{
        return Promise.reject(err)
      });

    return status
  }

  //hook for changing address object to then set bin day data
  React.useMemo(()=>{
  	console.log('set addressObj')
  	//console.log(addressObj)
  	if (addressObj) {
  		fetchDays(addressObj["Assessment Number"])
      .then((res)=>setBinDays(res))
      .catch((e)=>{
        console.log(e)
      })
  	}else{
  		setBinDays({area:false,zone:false,day:false,days:false})
  	}
  },[
  	addressObj
  ])

  //hook for changing bin day data
  React.useMemo(()=>{
  	console.log('set bin days')
  	console.log(binDays)
  },[
  	binDays
  ])


  React.useMemo(()=>{

  	hasAddress().then((val) => {
		 	console.log('run on has address');

	    setAddress(val["Property Address"])
	    setAddressObj(val)
	  });

  	if(!address) {
  		setAddressObj(false);
  		setBinDays({area:false,zone:false,day:false,days:false});
  	}
  },[
  	address
  ])

  React.useMemo(()=>{
  	console.log('set notifications')
  	console.log(notifications)
	  hasNotification().then((val) => {
	  	if (val){
	  	 setNotifications(true);
	  	 setConfig(val);
	  	}
	  });
  },[
  	notifications
  ])


  let shareMessage = {}

  if(Platform.OS === 'android'){
    shareMessage = {
      title : "I’m loving Hobson Bay City Council’s Recycling 2.0 app - bin collection schedule, reminders and info on what does/doesn’t go in each bin, all on my phone. Find out how to download for your phone too:",
      message: "https://www.hobsonsbay.vic.gov.au/recycling2.0app"
    }
  }else if(Platform.OS === 'ios'){
    shareMessage = {
        message:
          "I’m loving Hobson Bay City Council’s Recycling 2.0 app - bin collection schedule, reminders and info on what does/doesn’t go in each bin, all on my phone. Find out how to download for your phone too:",
        url: "https://www.hobsonsbay.vic.gov.au/recycling2.0app"
      }
  }

  const onShare = async () => {
    try {
      const result = await Share.share(shareMessage);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };


  //console.log('context rerender')

  return <DataContext.Provider 
			  	value={{
				  	addressObj, setAddressObj, 
				  	address, setAddress,
            fullAddress,
				  	notifications, setNotifications,
				  	config, setConfig,
				  	binDays, setBinDays,
				  	onShare,
				  	onboard, setOnboard,
            notificationsOn, notificationsOff, notificationsChange
				  }} {...props} 
				 />
}

export {AppDataProvider, useData }