const { getConfig, postConfig, putConfig, deleteConfig } = require('./_services/configs');

module.exports = async (req, res) => {
  // id - mobile random agility id
  const { method, body } = req;
  const { id = '' } = req.query;
  let data = null;

  switch (method) {
    case 'GET':
      data = await getConfig(id);
      break;
    case 'POST':
      data = await postConfig(body);
      break;
    case 'PUT':
      data = await putConfig(id, body);
      break;
    case 'DELETE':
      data = await deleteConfig(id);
      break;

    default:
      res.status(400);
      return;
  }

  res.status(200).json(data);
};
