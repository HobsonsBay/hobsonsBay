const { sendReminders, testReminders, fetchReminders, getConfigsAWS } = require('./_services/reminders');
const { syncItems } = require('./_services/algolia');
const { newsfeed } = require('./_services/newsfeed_notifications');

module.exports = async (req, res) => {
  const { action } = req.query;
  let hour = '0000';

  switch (action) {
    case 'reminders':
      hour = await sendReminders();
      break;
    case 'test':
      hour = await testReminders();
      break;
    case 'testnews':
      hour = await newsfeed();
      //hour = await getConfigsAWS("Thursday Area 4","1800",1);
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
