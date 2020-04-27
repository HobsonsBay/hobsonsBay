const { getAddresses } = require('./_services/addresses');

module.exports = async (req, res) => {
  // asn - assessment number
  const { asn = '' } = req.query;
  const data = await getAddresses(asn);
  res.status(200).json(data);
};
