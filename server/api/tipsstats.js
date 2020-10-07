const { getStats, getTipCats, getTips } = require('./_services/tips_stats');

module.exports = async (req, res) => {
	// let all = getTipsStats();

	// console.log(all)
	
	let statsFetch = await getStats();
	let tipCats = await getTipCats();
	let tipFetch = await getTips();
  let data = await {
		categories: tipCats,
		tips: tipFetch,
		stats: statsFetch
  }

  res.status(200).send(data);
};

