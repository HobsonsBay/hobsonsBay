const { sendReminders } = require('./_services/reminders');
const { syncItems } = require('./_services/algolia');

module.exports = async (req, res) => {
  const { action } = req.query;
  let hour = '0000';

  switch (action) {
    case 'reminders':
      hour = await sendReminders();
      break;
    case 'items':
      hour = await syncItems();
      break;
    default:
      res.status(400);
      return;
  }
  res.status(200).send(hour);
};
