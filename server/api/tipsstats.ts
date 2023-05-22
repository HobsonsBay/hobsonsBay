import { getStats, getTipCats, getTips } from "./services/tipstats";

module.exports = async (req, res) => {
  let statsFetch = await getStats();
  let tipCats = await getTipCats();
  let tipFetch = await getTips();
  let data = await {
    categories: tipCats,
    tips: tipFetch,
    stats: statsFetch,
  };
  res.status(200).send(data);
};
