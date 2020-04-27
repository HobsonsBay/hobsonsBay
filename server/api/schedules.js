const { getSchedules } = require('./_services/schedules');

module.exports = async (req, res) => {
  // day - collection day
  // area - collection area
  const { day = '', area = '' } = req.query;
  const data = await getSchedules(day, area);
  res.status(200).json(data);
};
