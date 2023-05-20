import {
  deleteConfig,
  getConfig,
  getDb,
  getTokens,
  postConfig,
  putConfig,
} from "./services/config";
module.exports = async (req, res) => {
  const { method, body } = req;
  const { id = "" } = req.query;
  const { service } = req.query;
  let data;
  switch (method) {
    case "GET":
      data = await getConfig(id);

      break;
    case "POST":
      data = await postConfig(body);

      break;
    case "PUT":
      data = await putConfig(id, body);

      break;
    case "DELETE":
      data = await deleteConfig(id);

      break;

    default:
      res.status(400);
      return;
  }

  res.status(200).json(data);
};
