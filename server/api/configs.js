const { 
  getConfig, 
  get_mysql, 
  postConfig, 
  post_mysql, 
  putConfig, 
  put_mysql,
  deleteConfig, 
  delete_mysql, 
  getTokens, 
  getDb, 
  testMysql 
} = require('./_services/configs');

module.exports = async (req, res) => {

  // id - mobile random agility id
  const { method, body } = req;
  const { id = '' } = req.query;
  const { service } = req.query;
  let data = null;

  
  /* test config

  {
    id: 5f06bf5f1b3737001557060e
    time: 1800
    token: dwCMPUKnL8Q:APA91bGRSLUMRZw8OsLezds4kD8vXPVJOYHR6FJOGor2PDUgZm2KX3bYXH8LDoHqqiOuTLyZ7-Yy3klFA73Shb4aPKsKD9DmEatknPQdAmDhTVksDV25y-nxPBNZhKyw1iGl-3NqJNwA
    zone: Thursday Area 1
  }
  */
  // if (id != ''){
  //   const tokens = await getTokens(req.query.token).then(tokens => {
  //     console.log(tokens)
  //   });
  // }

  switch (method) {
    case 'GET':
      // await (service == 'aws') ? data = testMysql(id) : data = getConfig(id);
      if (service == 'aws'){
        data = await get_mysql(id);
      }else{
        data = await getConfig(id);
      }
      break;
    case 'POST':
      console.log(body)
      if (service == 'aws'){
        data = await post_mysql(body);
      }else{
        data = await postConfig(body);
      }
      break;
    case 'PUT':
      if (service == 'aws'){
        data = await put_mysql(id, body);
      }else{
        data = await putConfig(id, body);
      }
      break;
    case 'DELETE':
      if (service == 'aws'){
        data = await delete_mysql(id);
      }else{
        data = await deleteConfig(id);
      }
      break;

    default:
      res.status(400);
      return;
  }

  console.log(data);

  res.status(200).json(data);
};
