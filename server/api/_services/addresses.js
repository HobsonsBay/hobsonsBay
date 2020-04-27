const fetch = require('isomorphic-fetch');
const map = require('lodash/map');
const join = require('lodash/join');
const get = require('lodash/get');

const {
  APPLICATION_ID,
  API_KEY,
  KNACK_API_URL,
  KNACK_PROPERTY_OBJECT_ID
} = process.env;

const OBJECT_URL = `${KNACK_API_URL}${KNACK_PROPERTY_OBJECT_ID}`;

const getAddresses = async (asn) => {
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
        field: 'field_1618',
        operator: 'is',
        value: asn
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
    const street = get(rec, 'field_1619.street');
    const street2 = get(rec, 'field_1619.street2', '');
    const city = get(rec, 'field_1619.city');
    const state = get(rec, 'field_1619.state');
    const zip = get(rec, 'field_1619.zip');
    const st = `${street}${street2 ? ` ${street2}` : ''}`;

    return {
      address: `${st} ${city}, ${state} ${zip}`,
      asn: get(rec, 'field_1618'),
      day: get(rec, 'field_1854'),
      area: get(rec, 'field_1855')
    };
  });

  return { rows };
};

module.exports = {
  getAddresses
};
