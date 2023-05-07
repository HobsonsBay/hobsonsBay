import AsyncStorage from '@react-native-async-storage/async-storage';

const hasNotification = async (): Promise<boolean> => {
  let out = false;
  await AsyncStorage.getItem('config')
    .then((value) => {
      const config = JSON.parse(value ?? 'null');
      if (config) {
        out = config;
      } else {
        out = false;
      }
    })
    .catch(console.error);
  return out;
};

const clearNotification = async (): Promise<void> => {
  await AsyncStorage.removeItem('config');
};

export {hasNotification, clearNotification};
