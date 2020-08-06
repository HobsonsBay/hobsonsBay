import AsyncStorage from '@react-native-community/async-storage';
import {
  useState,
  useEffect
} from 'react';

export default () => {
  const [data, setData] = useState(false);
  const getNotification = () => {
    return AsyncStorage.getItem('config').then((value) => {
        const config = JSON.parse(value);
        if (config) {
          return true;
        }else{
          return false;
        }
    })
	}

  useEffect(() => {
    getNotification()
      .then((config) => setData(config))
      .catch(() => setData(false));
  }, []);

  console.log('effect called',data)

  return data;
};