/* global fetch */
import AsyncStorage from '@react-native-community/async-storage';
import {
  useState,
  useEffect
} from 'react';
const { API_URL } = require('../config/api');

export default () => {
  const [data, setData] = useState(null);
  const getAddress = () => {
    return AsyncStorage.getItem('address')
      .then((value) => {
        const address = JSON.parse(value);
        const asn = address['Assessment Number'];
        return fetch(`${API_URL}/addresses?asn=${asn}`);
      })
      .then((res) => res.json())
      .then(({ rows }) => rows[0]);
  };

  useEffect(() => {
    console.log('trigger use fulladdress')
    getAddress()
      .then((fullAddress) => setData(fullAddress))
      .catch(() => setData(null));
  }, []);

  return [data];
};
