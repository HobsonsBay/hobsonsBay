/* global fetch */
import Config from 'react-native-config';
export default (id: string, body: string) => {
  const CONFIG_URL = `${Config.API_URL}/configs?id=${id}`;
  console.log(body);
  //const CONFIG_URL = `${API_URL_DEV}/configs?id=${id}&service=aws`;
  return fetch(CONFIG_URL, {
    method: 'put',
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
