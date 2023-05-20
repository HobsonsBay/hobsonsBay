/* global fetch */
// import hashFunc from './hashFunc';
// API_URL_DEV, API_URL_LOCAL
const {API_URL} = require('../config/api');
import Config from 'react-native-config';
export default (body: string) => {
  const CONFIG_URL = `${Config.API_URL}/quiz?action=quizData`;

  console.log(JSON.stringify(body));

  return fetch(CONFIG_URL, {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((error) => {
      return Promise.reject(error);
    });
};
