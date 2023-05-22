import { getAddresses } from "./services/getAddresses";

module.exports = async (req, res) => {
  // asn - assessment number
  const { asn = '' } = req.query;
  const data = await getAddresses(asn);
  res.status(200).json(data);
};
