/* global fetch */
import hashFunc from './hashFunc';
const { API_URL, API_URL_DEV, API_URL_LOCAL } = require('../config/api');


export default () => {

  //const CONFIG_URL = `${API_URL}/quiz?action=getQuiz`;
  //const CONFIG_URL = `${API_URL_DEV}/quiz?action=getQuiz`;
  const CONFIG_URL = `${API_URL}/quiz?action=getQuiz`;
  //const CONFIG_URL = "http://192.168.1.100:8080/api/quiz?action=getQuiz";

  return fetch(CONFIG_URL,
    {
      method: 'get',
      headers: {
        'Content-type': 'application/json'
      },
    })
    .then((res) => {
      //console.log('json fetch',res);
      return res.json();
    })
    .catch((error) => Promise.reject(error));
};
