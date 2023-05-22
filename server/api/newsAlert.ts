import { getSchedules } from "./services/schedules";
import { newsAlertReminder } from "./services/sendNewReminders";

module.exports = async (req, res) => {
  // day - collection day
  // area - collection area

  const data = await newsAlertReminder();
  res.status(200).json(data);
};
