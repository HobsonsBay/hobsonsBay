import React from 'react'
import { hasAddress, clearAddress } from './handleAddress';
import { hasNotification } from './hasNotification';
import fetchDays from '../hooks/fetchDays';
import { Share } from 'react-native';

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
	const [binDays, setBinDays] = React.useState({area:false,zone:false,day:false,days:false});
	const [config, setConfig] = React.useState(null);
  const [notifications, setNotifications] = React.useState(false);
  const [onboard, setOnboard] = React.useState(true);

  //hook for changing address object to then set bin day data
  React.useMemo(()=>{
  	console.log('set addressObj')
  	//console.log(addressObj)
  	if (addressObj) {
  		fetchDays(addressObj["Assessment Number"]).then((res)=>setBinDays(res))
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
  	console.log('set address')
  	//console.log(address)  
  	hasAddress().then((val) => {
	  	/*
	  	sample address payload
	  	{
	  		"Assessment Number": 9008500150, 
	  		"ID Agility Property": 39099, 
	  		"Property Address": "17 Mulholland Lane Newport, VIC 3015", 
	  		"__position": 1, 
	  		"_highlightResult": {
	  			"Property Address": {
	  				"matchLevel": "none", 
	  				"matchedWords": [Array], 
	  				"value": "17 Mulholland Lane Newport, VIC 3015"
	  			}
	  		}, 
	  		"objectID": "9008500150"
	  	}
		 	*/
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
      message: "https://www.hobsonsbay.vic.gov.au/Services/Recycling-2.0-Waste-and-recycling-services/Recycling-2.0-mobile-phone-app"
    }
  }else if(Platform.OS === 'ios'){
    shareMessage = {
        message:
          "I’m loving Hobson Bay City Council’s Recycling 2.0 app - bin collection schedule, reminders and info on what does/doesn’t go in each bin, all on my phone. Find out how to download for your phone too:",
        url: "https://www.hobsonsbay.vic.gov.au/Services/Recycling-2.0-Waste-and-recycling-services/Recycling-2.0-mobile-phone-app"
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
				  	notifications, setNotifications,
				  	config, setConfig,
				  	binDays, setBinDays,
				  	onShare,
				  	onboard, setOnboard
				  }} {...props} 
				 />
}

export {AppDataProvider, useData }