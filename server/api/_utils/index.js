const FOGO = 'Food and Garden';
const RUBBISH = 'Rubbish';
const RECYCLING_A = 'Commingled Recycling';
const RECYCLING_B = 'Mixed Recycling';
const GLASS = 'Glass';

const formatBinName = (type) => {
  switch (type) {
    case FOGO:
      return 'Food and Garden';
    case RUBBISH:
      return 'Rubbish';
    case RECYCLING_A:
    case RECYCLING_B:
      return 'Mixed Recycling';
    case GLASS:
      return 'Glass';
  }

  return type;
};

const hashFunc = (req) => {
  var str = req.url.substr(0,req.url.lastIndexOf('&auth'));
  str += "secret key"
  var hash = 0, i, chr;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  var buff = new Buffer.from(hash.toString()).toString("base64")
  return buff;
}

module.exports = {
  formatBinName,
  hashFunc
};
