const { getItems } = require('./_services/items');

module.exports = async (req, res) => {
  // number - item number
  const { number = '' } = req.query;
  const data = await getItems(number);
  res.status(200).json(data);
};
