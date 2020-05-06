/* global fetch */
import AsyncStorage from '@react-native-community/async-storage';
import {
  useState,
  useEffect,
  useCallback
} from 'react';
const { API_URL } = require('../config/api');

export default () => {
  const [data, setData] = useState(null);
  const getAddress = useCallback(() => {
    return AsyncStorage.getItem('address')
      .then((value) => {
        const address = JSON.parse(value);
        const asn = address['Assessment Number'];
        return fetch(`${API_URL}/addresses?asn=${asn}`);
      })
      .then((res) => res.json())
      .then(({ rows }) => rows[0]);
  }, []);

  useEffect(() => {
    getAddress()
      .then((fullAddress) => setData(fullAddress))
      .catch((e) => console.error('Error getting address', e));
  }, []);

  return [data];
};
