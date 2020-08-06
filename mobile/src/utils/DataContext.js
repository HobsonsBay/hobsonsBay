import React from 'react'
import hasAddress from './hasAddress';
import hasNotification from './hasNotification';
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
	const [binDays, setBinDays] = React.useState(null);
	const [configObj, setConfigObj] = React.useState(null);
  const [notifications, setNotifications] = React.useState(false);
  const [data, setData] = React.useState({address:false,notifications:false});


  // init with async values for address and notifications
  hasAddress().then((val) => {
  	//console.log(val);

  	/*
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

    setAddress(val["Property Address"])
    setAddressObj(val["Assessment Number"])
  });
  hasNotification().then((val) => {
    setNotifications(val)
  });

  const value = React.useMemo(() => {
  	data, setData, 
  	addressObj, setAddressObj, 
  	address, setAddress,
  	notifications, setNotifications,
  	binDays, setBinDays
  }, [
  	data, 
  	addressObj, 
  	address,
  	notifications
  ]);

  // console.log('new value');
  // console.log(value);



  React.useEffect(()=>{
  	console.log('set data')
  	console.log(data)
  },[
  	data
  ])
  React.useEffect(()=>{
  	console.log('set addressObj')
  	console.log(addressObj)
  	if (addressObj) fetchDays(addressObj).then((res)=>setBinDays(res))
  },[
  	addressObj
  ])
  React.useEffect(()=>{
  	console.log('set bin days')
  	console.log(binDays)
  },[
  	binDays
  ])
  React.useEffect(()=>{
  	console.log('set address')
  	console.log(address)
  	if(!address) {
  		setAddressObj(false);
  		setBinDays(null);
  	}
  },[
  	address
  ])
  React.useEffect(()=>{
  	console.log('set notifications')
  	console.log(notifications)
  },[
  	notifications
  ])
  console.log('context rerender')

  return <DataContext.Provider 
			  	value={{
			  		data, setData, 
				  	addressObj, setAddressObj, 
				  	address, setAddress,
				  	notifications, setNotifications,
				  	binDays, setBinDays
				  }} {...props} 
				 />
}

export {AppDataProvider, useData }