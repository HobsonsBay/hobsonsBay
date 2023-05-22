
import { syncItems } from "./services/syncItems";
module.exports = async (req, res) => {
  await syncItems();
  res.status(200).send(`Cron Job Completed`);
};
