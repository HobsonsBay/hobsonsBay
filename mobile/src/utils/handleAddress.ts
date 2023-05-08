import AsyncStorage from '@react-native-async-storage/async-storage';

const hasAddress = async (): Promise<boolean> => {
  let out = false;
  await AsyncStorage.getItem('address')
    .then((value) => {
      const addressVal = JSON.parse(value ?? 'null');
      if (addressVal) {
        out = addressVal;
      } else {
        out = false;
      }
    })
    .catch(console.error);
  return out;
};

const clearAddress = async (): Promise<void> => {
  await AsyncStorage.removeItem('address');
};

export {hasAddress, clearAddress};
