const fetch = require('isomorphic-fetch');
const map = require('lodash/map');
const join = require('lodash/join');
const get = require('lodash/get');

const {
  APPLICATION_ID,
  API_KEY,
  KNACK_API_URL,
  KNACK_BIN_DAYS_OBJECT_ID
} = process.env;

const OBJECT_URL = `${KNACK_API_URL}${KNACK_BIN_DAYS_OBJECT_ID}`;

const getSchedules = async (day, area) => {
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
        field: 'field_1943',
        operator: 'is',
        value: false
      },
      {
        field: 'field_1947',
        operator: 'is today or after'
      },
      {
        field: 'field_1951',
        operator: 'is',
        value: area
      },
      {
        field: 'field_1952',
        operator: 'is',
        value: day
      }
    ]
  };
  const query = {
    page: 1,
    rows_per_page: 10,
    format: 'raw',
    sort_field: 'field_1947',
    sort_order: 'asc',
    filters: encodeURIComponent(JSON.stringify(filters))
  };

  const QUERY = join(map(query, (value, key) => `${key}=${value}`), '&');
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options).then((response) => response.json());
  return fieldMapper(json);
};

const fieldMapper = ({ records }) => {
  const rows = map(records, (rec) => {
    return {
      date: get(rec, 'field_1947.date_formatted'),
      zone: get(rec, 'field_1950[0].identifier'),
      note: get(rec, 'field_1949'),
      bin_type: get(rec, 'field_1946')
    };
  });

  return { rows };
};

export {
  getSchedules
};
