/* global fetch */
import hashFunc from './hashFunc';
const { API_URL, API_URL_DEV } = require('../config/api');

export default (page) => {

  //const CONFIG_URL = `${API_URL_DEV}/configs`;
  const CONFIG_URL = `${API_URL}/newsfeed?page=${page}`;
  // const CONFIG_URL = `http://localhost:8080/api/health`;
  // console.log("raw = "+JSON.stringify(body))
  // console.log("b64 = "+hashFunc(JSON.stringify(body)));
  // console.log("raw")

  console.log('news api called')

  return fetch(CONFIG_URL,
    {
      method: 'get',
      headers: {
        'Content-type': 'application/json'
      },
    })
    .then((res) => {
      //console.log(res);
      return res.json()
    })
    .catch((error) => Promise.reject(error));
};
