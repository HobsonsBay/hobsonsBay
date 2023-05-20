/* global fetch */
import Config from 'react-native-config'
export default (page: string) => {
  //const CONFIG_URL = `${API_URL_DEV}/configs`;
  const CONFIG_URL = `${Config.API_URL}/newsfeed?page=${page}`;
  // const CONFIG_URL = `http://localhost:8080/api/health`;
  // console.log("raw = "+JSON.stringify(body))
  // console.log("b64 = "+hashFunc(JSON.stringify(body)));
  // console.log("raw")

  console.log('news api called');

  return fetch(CONFIG_URL, {
    method: 'get',
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((res) => {
      //console.log(res);
      return res.json();
    })
    .catch((error) => Promise.reject(error));
};
