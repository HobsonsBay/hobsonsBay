/* global fetch */
const { API_URL } = require('../config/api');

export default (body) => {
  const CONFIG_URL = `${API_URL}/configs`;
  return fetch(CONFIG_URL,
    {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then((res) => res.json());
};
