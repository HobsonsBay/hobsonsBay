/* global fetch */
const { API_URL, API_URL_DEV } = require('../config/api');

export default (id, body) => {
  const CONFIG_URL = `${API_URL}/configs?id=${id}`;
  //const CONFIG_URL = `${API_URL_DEV}/configs?id=${id}&service=aws`;
  return fetch(CONFIG_URL,
    {
      method: 'put',
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
