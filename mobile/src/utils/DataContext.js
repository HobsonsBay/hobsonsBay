import React from 'react'
import { hasAddress, clearAddress } from './handleAddress';
import { hasNotification } from './hasNotification';
import fetchDays from '../hooks/fetchDays';

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


  console.log('context rerender')

  return <DataContext.Provider 
			  	value={{
				  	addressObj, setAddressObj, 
				  	address, setAddress,
				  	notifications, setNotifications,
				  	config, setConfig,
				  	binDays, setBinDays,
				  }} {...props} 
				 />
}

export {AppDataProvider, useData }