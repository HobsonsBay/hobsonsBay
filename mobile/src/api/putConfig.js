/* global fetch */
const { API_URL } = require('../config/api');

export default (id, body) => {
  const CONFIG_URL = `${API_URL}/configs?id=${id}`;
  return fetch(CONFIG_URL,
    {
      method: 'put',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then((res) => res.json());
};
