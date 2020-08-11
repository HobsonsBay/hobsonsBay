//import React from "react";
import AsyncStorage from '@react-native-community/async-storage';

const hasAddress = async () => {
    let out = false;
    await AsyncStorage.getItem('address').then((value) => {
      const addressVal = JSON.parse(value);
      if(addressVal){
        out = addressVal;
      }else{
        out = false;
      }
    }).catch(console.error);
    return out;
}

const clearAddress = async () => {
	AsyncStorage.removeItem('address');
	return
}

export { hasAddress, clearAddress };
