/* global fetch */
import Config from 'react-native-config'
export default (body) => {

  const CONFIG_URL = `${Config.API_URL}/tipsstats`;

  //console.log(JSON.stringify(body))
  console.log(CONFIG_URL);

  return fetch(CONFIG_URL,
    {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
      redirect: 'follow'
    })
    .then((res) => {
      console.log("res",res)
      return res.json()
    })
    .catch((error) => {
      return Promise.reject(error)
    });
};
