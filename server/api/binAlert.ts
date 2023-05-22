import { sendReminders } from "./services/sendReminders";

module.exports = async (req, res) => {
  // day - collection day
  // area - collection area
  const data = await sendReminders();
  res.status(200).json(data);
};