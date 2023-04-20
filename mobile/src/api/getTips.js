/* global fetch */
import hashFunc from './hashFunc';
const { API_URL, API_URL_DEV, API_URL_LOCAL } = require('../config/api');

export default (body) => {

  const CONFIG_URL = `${API_URL}/tipsstats`;

  //console.log(JSON.stringify(body))
  console.log(CONFIG_URL);

  return fetch(CONFIG_URL,
    {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
      redirect: 'follow'
    })
    .then((res) => {
      console.log("res",res)
      return res.json()
    })
    .catch((error) => {
      return Promise.reject(error)
    });
};
