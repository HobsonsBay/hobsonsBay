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



export {
  formatBinName,
  
};
