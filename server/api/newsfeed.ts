import { getNewsfeed } from "./services/newsFeed";


module.exports = async (req, res) => {
  // day - collection day
  // area - collection area
  const { page = 1} = req.query;
  const data = await getNewsfeed(page);
  res.status(200).json(data);
};