//import React from "react";
import AsyncStorage from '@react-native-community/async-storage';

export default async function(){
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

//module.exports = hasAddress;
