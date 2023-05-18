import {Linking} from 'react-native';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import * as formatTz from 'date-fns-tz';
import isTomorrow from 'date-fns/isTomorrow';
import startWith from 'lodash/startsWith';
import min from 'lodash/min';
import trimEnd from 'lodash/trimEnd';
import sortBy from 'lodash/sortBy';

export const LINK = 'http';
export const FOGO = 'Food and Garden';
export const RUBBISH = 'Rubbish';
export const RECYCLING_A = 'Commingled Recycling';
export const RECYCLING_B = 'Mixed Recycling';
export const GLASS = 'Glass';

/* Helper functions used throughout the app */

export const openUrl = (url: string) => {
  return () => {
    Linking.canOpenURL(url)
      .then((supported) => supported && Linking.openURL(url))
      .catch(console.error);
  };
};

export const formatDate = (date: string) => {
  const d = parse(date, 'dd/MM/yyyy', new Date());
  return format(d, 'dd MMMM');
};

export const formatDayNumber = (date: string) => {
  const d = parse(date, 'dd/MM/yyyy', new Date());
  return format(d, 'dd');
};

export const formatDayTomorrow = (date: string) => {
  const d = parse(date, 'dd/MM/yyyy', new Date());
  const t = isTomorrow(d);
  const day = format(d, 'EEEE');
  return t ? 'Tomorrow' : day;
};

export const formatDay = (date: string) => {
  const d = parse(date, 'dd/MM/yyyy', new Date());
  return format(d, 'EEEE');
};

export const formatTime = (date = new Date()) => {
  // return format(date, 'hh:mm b', {timeZone: 'Australia/Melbourne'});
  return formatTz.format(date, 'hh:mm b', {timeZone: 'Australia/Melbourne'});
};

export const getReminderDate = (time: string) => {
  return parse(`${time}`, 'HHmm', new Date());
};

export const formatBinName = (type: string) => {
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

export const getBinImg = (type: string) => {
  switch (type) {
    case FOGO:
      return 'fogo';
    case RUBBISH:
      return 'rubbish';
    case RECYCLING_A:
    case RECYCLING_B:
      return 'recycling';
    case GLASS:
      return 'glass';
  }

  return 'fogo';
};

export const getBinImgNT = (type: string) => {
  switch (type) {
    case FOGO:
      return 'fogoNT';
    case RUBBISH:
      return 'rubbishNT';
    case RECYCLING_A:
    case RECYCLING_B:
      return 'recyclingNT';
    case GLASS:
      return 'glassNT';
  }

  return 'nobinNT';
};

export const getItemBinColor = (type: string) => {
  switch (type) {
    case FOGO:
      return '#9ACA3C';
    case RUBBISH:
      return '#536130';
    case RECYCLING_A:
    case RECYCLING_B:
      return '#FFDC00';
    case GLASS:
      return '#A032A0';
  }

  return '#D8D8D8';
};

export const getItemTextColor = (type: string) => {
  switch (type) {
    case FOGO:
    case RECYCLING_A:
    case RECYCLING_B:
      return '#212121';
    case RUBBISH:
    case GLASS:
      return '#ffffff';
  }

  return '#212121';
};

export const getItemBinLabel = (type: string) => {
  switch (type) {
    case FOGO:
    case RECYCLING_A:
    case RECYCLING_B:
    case RUBBISH:
    case GLASS:
      return `Place in ${type}`;
  }

  return type;
};

export const getAreaBackgroundColor = (area: string) => {
  switch (area) {
    case '1':
      return '#eae84e';
    case '2':
      return '#7ab038';
    case '3':
      return '#a6def2';
    case '4':
      return '#f2a0a3';
  }

  return '#eae84e';
};

export const getAreaColor = (area: string) => {
  switch (area) {
    case '1':
    case '3':
    case '4':
      return '#212121';
    case '2':
      return '#ffffff';
  }

  return '#212121';
};

export const getTokens = (text: string) => {
  if (!text) return [];
  const tokens = [];
  let j = 0;
  let i = 0;

  for (; i < text.length; i++) {
    const peak = `${text[i]}${text[i + 1]}${text[i + 2]}${text[i + 3]}`;
    if (peak === LINK) {
      tokens.push(text.substr(j, i - j));
      j = i;
    } else if (i === text.length - 1) {
      tokens.push(text.substr(j, text.length - j));
    }
  }

  const strings = [];
  let a = 0;

  for (; a < tokens.length; a++) {
    const token = tokens[a];
    if (startWith(token, LINK)) {
      const indices = [];
      token.indexOf(' ') !== -1 && indices.push(token.indexOf(' '));
      token.indexOf('\n') !== -1 && indices.push(token.indexOf('\n'));
      token.indexOf('\t') !== -1 && indices.push(token.indexOf('\t'));
      const index = min(indices);

      if (index && index > 0) {
        strings.push(token.substr(0, index));
        strings.push(trimEnd(token.substr(index).replace('\n', '')));
      } else {
        strings.push(trimEnd(token.replace('\n', '')));
      }
    } else {
      strings.push(trimEnd(token));
    }
  }

  return strings;
};

export const binSortOrder = (type: string) => {
  switch (type) {
    case FOGO:
      return '1';
    case RUBBISH:
      return '3';
    case RECYCLING_A:
    case RECYCLING_B:
      return '2';
    case GLASS:
      return '4';
  }

  return type;
};

export const sortBins = (bins: any) => {
  return sortBy(bins, (bin) => binSortOrder(bin.bin_type));
};
