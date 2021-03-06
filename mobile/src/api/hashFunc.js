const { API_SECRET } = require('../config/api');
const Buffer = require("buffer").Buffer;

export default hashFunc = (req) => {
  var str = req;
  str += API_SECRET
  var hash = 0, i, chr;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  var buff = new Buffer.from(hash.toString()).toString("base64")
  return buff;
}