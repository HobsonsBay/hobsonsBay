//import React from "react";
import AsyncStorage from '@react-native-community/async-storage';

export default async function(){
    let out = false;
    await AsyncStorage.getItem('config').then((value) => {
      const config = JSON.parse(value);
      if(config){
        out = true;
      }else{
        out = false;
      }
    }).catch(console.error);
    return out;
}

//module.exports = hasAddress;
