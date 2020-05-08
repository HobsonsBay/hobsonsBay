/* global fetch */
const { API_URL } = require('../config/api');

export default (id) => {
  const CONFIG_URL = `${API_URL}/configs?id=${id}`;
  return fetch(CONFIG_URL,
    {
      method: 'delete',
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then((res) => res.json());
};
