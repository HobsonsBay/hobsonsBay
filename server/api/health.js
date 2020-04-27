
module.exports = (req, res) => {
  const { ping = '1' } = req.query;
  res.status(200).send(`ping ${ping}`);
};
