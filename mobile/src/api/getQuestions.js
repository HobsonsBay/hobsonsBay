/* global fetch */
import hashFunc from './hashFunc';
const { API_URL, API_URL_DEV, API_URL_LOCAL } = require('../config/api');

export default (id) => {

  //const CONFIG_URL = `${API_URL}/quiz?action=getQuestions&quizid=${id}`;
  //const CONFIG_URL = `${API_URL_DEV}/quiz?action=getQuestions&quizid=${id}`;
  const CONFIG_URL = `${API_URL}/quiz?action=getQuestions&quizid=${id}`;
  //const CONFIG_URL = "http://192.168.1.100:8080/api/quiz?action=getQuestions&quizid="+id;

  return fetch(CONFIG_URL,
    {
      method: 'get',
      headers: {
        'Content-type': 'application/json'
      },
    })
    .then((res) => {
      console.log('json fetch',id);
      return res.json();
    })
    .catch((error) => Promise.reject(error));
};
