//import React from "react";
import AsyncStorage from '@react-native-community/async-storage';

const hasNotification = async () => {
    let out = false;
    await AsyncStorage.getItem('config').then((value) => {
      const config = JSON.parse(value);
      if(config){
        out = config;
      }else{
        out = false;
      }
    }).catch(console.error);
    return out;
}

const clearNotification = async () => {
  AsyncStorage.removeItem('config');
  return
}

export { hasNotification, clearNotification };
