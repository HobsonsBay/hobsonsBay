const fetch = require("isomorphic-fetch");
const get = require("lodash/get");
const map = require("lodash/map");
const join = require("lodash/join");
const util = require("util");
//const mysql = require('mysql');
const { APPLICATION_ID, API_KEY, KNACK_API_URL, KNACK_USER_CONFIGS_OBJECT_ID } =
  process.env;

const USER_CONFIGS_OBJECT_URL = `${KNACK_API_URL}${KNACK_USER_CONFIGS_OBJECT_ID}`;

/* TODOS

  Migrate this system to aws.

  This will require a link to the aws db
  a process for handling agility ID requests and mysql id's
  to maintain backwards compatability this will need to
  take the id parameter from agility and also the id parameter from mysql
  the id from agility is a string, so it won't be able to be stored in an auto incrementing field
  we'll have to create a sytem that can handle both

  if the id is an agility id (string) search for that,
  if the id is a number, use the mysql id field.

  app configs are updated each time, so a request sent with an agility id
  can return a response with a mysql id and use that going forawrds

  also, the cron just matches for area and time, using the prescence of the row
  to determine whether to send the value or not.
  this will have to be changed to use a flag in the db instead.
  reminders = true
  service messages = true

  if no id exists, the record is created and id is returned
  if either exist, the record is updated
  if both are set to false, the record is removed

*/

// post initial config and return ID
const postConfig = async (record) => {
  const RECORDS_URL = `${USER_CONFIGS_OBJECT_URL}/records`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      field_2218: get(record, "token"),
      field_2219: get(record, "zone"),
      field_2221: get(record, "time"),
      field_5341: get(record, "type_reminder"),
      field_5342: get(record, "type_service"),
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Knack-Application-Id": APPLICATION_ID,
      "X-Knack-REST-API-KEY": API_KEY,
    },
  };
  const json = await fetch(`${RECORDS_URL}`, options).then((response) =>
    response.json()
  );
  return fieldMapper(json);
};

// update existing config
const putConfig = async (id, record) => {
  const RECORDS_URL = `${USER_CONFIGS_OBJECT_URL}/records`;
  const options = {
    method: "PUT",
    body: JSON.stringify({
      field_2218: get(record, "token"),
      field_2219: get(record, "zone"),
      field_2221: get(record, "time"),
      field_5341: get(record, "type_reminder"),
      field_5342: get(record, "type_service"),
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Knack-Application-Id": APPLICATION_ID,
      "X-Knack-REST-API-KEY": API_KEY,
    },
  };
  const json = await fetch(`${RECORDS_URL}/${id}`, options).then((response) =>
    response.json()
  );
  return fieldMapper(json);
};

// return existing config based on ID
const getConfig = async (id) => {
  const RECORDS_URL = `${USER_CONFIGS_OBJECT_URL}/records`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Knack-Application-Id": APPLICATION_ID,
      "X-Knack-REST-API-KEY": API_KEY,
    },
  };
  const json = await fetch(`${RECORDS_URL}/${id}`, options).then((response) =>
    response.json()
  );
  return fieldMapper(json);
};

// Remove config from database
const deleteConfig = async (id) => {
  const RECORDS_URL = `${USER_CONFIGS_OBJECT_URL}/records`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-Knack-Application-Id": APPLICATION_ID,
      "X-Knack-REST-API-KEY": API_KEY,
    },
  };
  return fetch(`${RECORDS_URL}/${id}`, options).then((response) =>
    response.json()
  );
};

// check to see if there are multiple configs in the database
const getTokens = async (token) => {
  const RECORDS_URL = `${USER_CONFIGS_OBJECT_URL}/records`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Knack-Application-Id": APPLICATION_ID,
      "X-Knack-REST-API-KEY": API_KEY,
    },
  };
  const filters = {
    match: "and",
    rules: [
      {
        field: "field_2218",
        operator: "is",
        value: token,
      },
    ],
  };
  const query = {
    page: 1,
    rows_per_page: 1000,
    format: "raw",
    filters: encodeURIComponent(JSON.stringify(filters)),
  };
  const QUERY = join(
    map(query, (value, key) => `${key}=${value}`),
    "&"
  );
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options).then(
    (response) => response.json()
  );

  let ids = [];
  if (json.records.length > 0) {
    ids = json.records.map((id) => id.id);
  }
  return ids;
};

const getDb = async () => {
  const RECORDS_URL = `${USER_CONFIGS_OBJECT_URL}/records`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Knack-Application-Id": APPLICATION_ID,
      "X-Knack-REST-API-KEY": API_KEY,
    },
  };
  const query = {
    page: 1,
    rows_per_page: 1000,
    format: "raw",
  };
  const QUERY = join(
    map(query, (value, key) => `${key}=${value}`),
    "&"
  );
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options).then(
    (response) => response.json()
  );

  let csvOut = '"k_id","token","zone","time"\n';
  json.records.forEach((key, idx) => {
    //console.log(key.id)
    // 1,"**********0:APA91bGaU70LoC23DZ8A6FaCXix8fixad7IUBvoPamsRg-WDGOwfCniKLymAaZbII524VhtR_SRdOpgMiQ3nzhjQwHwZqCTz6j50bbwv_HIAHHm_F5e2fx_HYbIp1AvMLT5tsUV1VLc_"," Thursday Area 3","18:00:00"
    csvOut += `"${key.id}","${key.field_2218}","${key.field_2219}","${key.field_2221}"\n`;
  });
  return csvOut;
};

const fieldMapper = (rec) => {
  return {
    id: get(rec, "id"),
    token: get(rec, "field_2218"),
    zone: get(rec, "field_2219"),
    time: get(rec, "field_2221"),
    type_reminder: get(rec, "field_5341"),
    type_service: get(rec, "field_5342"),
  };
};

export { postConfig, putConfig, getConfig, deleteConfig, getTokens, getDb };
