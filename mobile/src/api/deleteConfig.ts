/* global fetch */

const {API_URL} = require('../config/api');

export default (id: string) => {
  //const CONFIG_URL = `${API_URL_DEV}/configs?id=${id}&service=aws`;
  const CONFIG_URL = `${API_URL}/configs?id=${id}`;
  return fetch(CONFIG_URL, {
    method: 'delete',
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      return Promise.reject(error);
    });
};
