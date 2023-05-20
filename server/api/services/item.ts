// const fetch = require('isomorphic-fetch');
const map = require('lodash/map');
const join = require('lodash/join');
const get = require('lodash/get');

const {
  APPLICATION_ID,
  API_KEY,
  KNACK_API_URL,
  KNACK_ITEM_OBJECT_ID
} = process.env;

const OBJECT_URL = `${KNACK_API_URL}${KNACK_ITEM_OBJECT_ID}`;

const getItems = async (number) => {
  const RECORDS_URL = `${OBJECT_URL}/records`;
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
        field: 'field_2001',
        operator: 'is',
        value: number
      }
    ]
  };
  const query = {
    page: 1,
    rows_per_page: 2,
    format: 'raw',
    filters: encodeURIComponent(JSON.stringify(filters))
  };

  const QUERY = join(map(query, (value, key) => `${key}=${value}`), '&');
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options).then((response) => response.json());
  return fieldMapper(json);
};

const fieldMapper = ({ records }) => {
  const rows = map(records, (rec) => {
    const lastUpdatedDays = Math.floor(get(rec, 'field_2007', 0) / 86400);

    return {
      status: get(rec, 'field_2014'),
      number: get(rec, 'field_2001'),
      name: get(rec, 'field_2015'),
      url: get(rec, 'field_2029.url', null),
      bin_type: get(rec, 'field_2016'),
      description: get(rec, 'field_2013'),
      alternative_disposal: get(rec, 'field_2017'),
      additional_info: get(rec, 'field_2018'),
      disposal_guidance: get(rec, 'field_2019'),
      last_updated_days: lastUpdatedDays
    };
  });

  return { rows };
};

export {
  getItems
};
