const { hashFunc } = require('./_utils');

module.exports = (req, res) => {
	// console.log(req)

	// raw = {
	// 	"id":"1"
	// 	"token":"ezpmBKADQxC4hmmYMmM-bt:APA91bFimwRHtwthNyj7EhPfFMlYyzJlogdCExLEOFRMqciHIXafKFmbUrAFtRS9hOd-JszdXRLYjIBQfTnQxra4oh-zAX509qeEajnl2kcbDLpF8YaWv8ES3Ub-lGO2mi7xAjVfe7AP",
	// 	"zone":"Thursday Area 2",
	// 	"time":"1800"
	// }
	// /*	b64 = NjQwMjYzNzAy
	// */
	// if (req.query.auth == hashFunc(req)){
	//   const { ping = '1' } = req.query;
	//   res.status(200).send(`ping ${ping}`);
	// }else{
	// 	res.status(403).send("not authorised");
	// }


  const { ping = '1' } = req.query;
  res.status(200).send(`ping ${ping}`);
};
