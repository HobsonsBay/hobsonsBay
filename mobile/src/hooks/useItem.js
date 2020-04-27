/* global fetch */
import {
  useState,
  useEffect
} from 'react';
const { API_URL } = require('../config/api');

export default (number) => {
  const [data, setData] = useState({});
  const getItem = (number) => {
    const ITEM_URL = `${API_URL}/items?number=${number}`;
    return fetch(ITEM_URL)
      .then((res) => res.json())
      .then(({ rows }) => rows[0]);
  };

  useEffect(() => {
    if (number) {
      getItem(number)
        .then((row) => {
          console.log(row);
          setData({ ...row });
        }).catch((e) => console.error('Error getting item', e));
    }
  }, [number]);

  return [data];
};
