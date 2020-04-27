const fetch = require('isomorphic-fetch');
const get = require('lodash/get');
const {
  APPLICATION_ID,
  API_KEY,
  KNACK_API_URL,
  KNACK_USER_CONFIGS_OBJECT_ID
} = process.env;

const USER_CONFIGS_OBJECT_URL = `${KNACK_API_URL}${KNACK_USER_CONFIGS_OBJECT_ID}`;

const postConfig = async (record) => {
  const RECORDS_URL = `${USER_CONFIGS_OBJECT_URL}/records`;
  const options = {
    method: 'POST',
    body: JSON.stringify({
      field_2218: get(record, 'token'),
      field_2219: get(record, 'zone'),
      field_2221: get(record, 'time')
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-Knack-Application-Id': APPLICATION_ID,
      'X-Knack-REST-API-KEY': API_KEY
    }
  };
  const json = await fetch(`${RECORDS_URL}`, options).then((response) => response.json());
  return fieldMapper(json);
};

const putConfig = async (id, record) => {
  const RECORDS_URL = `${USER_CONFIGS_OBJECT_URL}/records`;
  const options = {
    method: 'PUT',
    body: JSON.stringify({
      field_2218: get(record, 'token'),
      field_2219: get(record, 'zone'),
      field_2221: get(record, 'time')
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-Knack-Application-Id': APPLICATION_ID,
      'X-Knack-REST-API-KEY': API_KEY
    }
  };
  const json = await fetch(`${RECORDS_URL}/${id}`, options).then((response) => response.json());
  return fieldMapper(json);
};

const getConfig = async (id) => {
  const RECORDS_URL = `${USER_CONFIGS_OBJECT_URL}/records`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Knack-Application-Id': APPLICATION_ID,
      'X-Knack-REST-API-KEY': API_KEY
    }
  };
  const json = await fetch(`${RECORDS_URL}/${id}`, options).then((response) => response.json());
  return fieldMapper(json);
};

const deleteConfig = async (id) => {
  const RECORDS_URL = `${USER_CONFIGS_OBJECT_URL}/records`;
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Knack-Application-Id': APPLICATION_ID,
      'X-Knack-REST-API-KEY': API_KEY
    }
  };
  return fetch(`${RECORDS_URL}/${id}`, options).then((response) => response.json());
};

const fieldMapper = (rec) => {
  return {
    id: get(rec, 'id'),
    token: get(rec, 'field_2218'),
    zone: get(rec, 'field_2219'),
    time: get(rec, 'field_2221')
  };
};

module.exports = {
  postConfig,
  putConfig,
  getConfig,
  deleteConfig
};
