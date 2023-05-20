import { sendReminders } from "./services/sendReminders";

// const { getNewsfeed } = require('./_services/newsfeed_notifications');

module.exports = async (req, res) => {
  // day - collection day
  // area - collection area
  const { page = 1} = req.query;
  const data = await sendReminders();
  res.status(200).json(data);
};