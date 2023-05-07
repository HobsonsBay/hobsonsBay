import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect, useCallback} from 'react';

export default (): boolean => {
  const [data, setData] = useState<boolean>(false);

  const getNotification = useCallback(async (): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem('config');
      const config = value && JSON.parse(value);
      return Boolean(config);
    } catch (error) {
      console.error('Error getting config:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    getNotification()
      .then((config) => setData(config))
      .catch(() => setData(false));
  }, [getNotification]);

  console.log('effect called', data);

  return data;
};
