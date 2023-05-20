/* global fetch */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';

import Config from 'react-native-config';
interface FullAddress {
  [key: string]: any;
}

const useFullAddress = (): [FullAddress | null] => {
  const [data, setData] = useState<FullAddress | null>(null);

  const getAddress = (): Promise<FullAddress> => {
    return AsyncStorage.getItem('address')
      .then((value) => {
        const address = JSON.parse(value!);
        const asn = address['Assessment Number'];
        return fetch(`${Config.API_URL}/addresses?asn=${asn}`);
      })
      .then((res) => res.json())
      .then(({rows}) => rows[0]);
  };

  useEffect(() => {
    console.log('trigger use fulladdress');
    getAddress()
      .then((fullAddress) => setData(fullAddress))
      .catch(() => setData(null));
  }, []);

  return [data];
};

export default useFullAddress;
