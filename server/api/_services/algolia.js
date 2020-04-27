const format = require('date-fns/format');
const differenceInMinutes = require('date-fns/differenceInMinutes');
const startOfHour = require('date-fns/startOfHour');
const fetch = require('isomorphic-fetch');
const map = require('lodash/map');
const join = require('lodash/join');
const get = require('lodash/get');
const algoliasearch = require('algoliasearch');

const {
  APPLICATION_ID,
  API_KEY,
  KNACK_API_URL,
  KNACK_ITEM_OBJECT_ID,
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY
} = process.env;

const ITEM_OBJECT_URL = `${KNACK_API_URL}${KNACK_ITEM_OBJECT_ID}`;

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

const syncItems = async () => {
  const index = client.initIndex('items');
  const nowDate = new Date();
  const hourStart = startOfHour(nowDate);
  const difference = differenceInMinutes(nowDate, hourStart);
  let hour = format(nowDate, 'HHmm');

  if (difference < 1) {
    hour = format(hourStart, 'HHmm');
    let page = 1;
    let results = [];
    do {
      const { rows } = await getItems(page);
      results = rows;
      await index.saveObjects(results);
      ++page;
    }
    while (results.length >= 1000);
  }
  console.log('cron ', hour);
  return hour;
};

const getItems = async (page) => {
  const RECORDS_URL = `${ITEM_OBJECT_URL}/records`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Knack-Application-Id': APPLICATION_ID,
      'X-Knack-REST-API-KEY': API_KEY
    }
  };
  const filters = {
    match: 'and',
    rules: [
      {
        field: 'field_2014',
        operator: 'is',
        value: 'Live'
      }
    ]
  };
  const query = {
    page: page,
    rows_per_page: 1000,
    format: 'raw',
    filters: encodeURIComponent(JSON.stringify(filters))
  };

  const QUERY = join(map(query, (value, key) => `${key}=${value}`), '&');
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options).then((response) => response.json());
  return itemMapper(json);
};

const itemMapper = ({ records }) => {
  const rows = map(records, (rec) => {
    return {
      objectID: get(rec, 'field_2001'),
      'Item Number': get(rec, 'field_2001'),
      'Item Name': get(rec, 'field_2015'),
      'Key Words': get(rec, 'field_2126')
    };
  });

  return { rows };
};

module.exports = {
  syncItems
};
