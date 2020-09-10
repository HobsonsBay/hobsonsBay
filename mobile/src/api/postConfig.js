/* global fetch */
import hashFunc from './hashFunc';
const { API_URL, API_URL_DEV } = require('../config/api');

export default (body) => {

  const CONFIG_URL = `${API_URL}/configs`;
  //const CONFIG_URL = `${API_URL_DEV}/configs?service=aws`;
  // const CONFIG_URL = `http://localhost:8080/api/health`;
  // console.log("raw = "+JSON.stringify(body))
  // console.log("b64 = "+hashFunc(JSON.stringify(body)));
  // console.log("raw")
  console.log(JSON.stringify(body))

  return fetch(CONFIG_URL,
    {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then((res) => res.json())
    .catch((error) => {
      return Promise.reject(error)
    });
};
