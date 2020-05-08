const format = require('date-fns/format');
const differenceInMinutes = require('date-fns/differenceInMinutes');
const startOfHour = require('date-fns/startOfHour');
const fetch = require('isomorphic-fetch');
const groupBy = require('lodash/groupBy');
const map = require('lodash/map');
const join = require('lodash/join');
const get = require('lodash/get');
const keys = require('lodash/keys');
const { formatBinName } = require('../_utils');
const admin = require('firebase-admin');

const {
  APPLICATION_ID,
  API_KEY,
  KNACK_API_URL,
  KNACK_BIN_DAYS_OBJECT_ID,
  KNACK_USER_CONFIGS_OBJECT_ID,
  FIREBASE_ADMIN
} = process.env;

const BIN_DAYS_OBJECT_URL = `${KNACK_API_URL}${KNACK_BIN_DAYS_OBJECT_ID}`;
const USER_CONFIGS_OBJECT_URL = `${KNACK_API_URL}${KNACK_USER_CONFIGS_OBJECT_ID}`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(FIREBASE_ADMIN))
});

const sendReminders = async () => {
  const nowDate = new Date();
  const hourStart = startOfHour(nowDate);
  const difference = differenceInMinutes(nowDate, hourStart);
  let hour = format(nowDate, 'HHmm');

  if (difference < 1) {
    const { rows } = await getZones();
    const groupedZones = groupBy(rows, 'zone');
    const zones = keys(groupedZones);
    hour = format(hourStart, 'HHmm');

    for (let i = 0; i < zones.length; i++) {
      const zone = zones[i];
      const bins = groupedZones[zone];
      const message = binMessage(zone, bins);

      let page = 1;
      let results = [];
      do {
        const { rows } = await getConfigs(zone, hour, page);
        results = rows;
        const tokens = map(rows, (row) => row.token);
        await admin.messaging().sendToDevice(tokens,
          { notification: { ...message } }
        );
        ++page;
      }
      while (results.length >= 1000);
    }
  }
  console.log('cron ', hour);
  return hour;
};

const binMessage = (zone, bins) => {
  const binNames = map(bins, bin => formatBinName(bin.bin_type));
  const day = zone.split(' ')[0];
  return {
    title: `Your bin collection day is tomorrow, ${day}`,
    body: `Please have your ${binNames.join(', ')} bins out on the nature strip by 5am.`
  };
};

const getConfigs = async (zone, hour, page) => {
  const RECORDS_URL = `${USER_CONFIGS_OBJECT_URL}/records`;
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
        field: 'field_2219',
        operator: 'is',
        value: zone
      },
      {
        field: 'field_2221',
        operator: 'is',
        value: hour
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
  return configMapper(json);
};

const getZones = async () => {
  const RECORDS_URL = `${BIN_DAYS_OBJECT_URL}/records`;
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
        operator: 'is during the next',
        range: 1,
        type: 'days'
      }
    ]
  };
  const query = {
    page: 1,
    rows_per_page: 15,
    format: 'raw',
    sort_field: 'field_1951',
    sort_order: 'asc',
    filters: encodeURIComponent(JSON.stringify(filters))
  };

  const QUERY = join(map(query, (value, key) => `${key}=${value}`), '&');
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options).then((response) => response.json());
  return zoneMapper(json);
};

const configMapper = ({ records }) => {
  const rows = map(records, (rec) => {
    return {
      id: get(rec, 'id'),
      token: get(rec, 'field_2218'),
      zone: get(rec, 'field_2219'),
      time: get(rec, 'field_2221')
    };
  });

  return { rows };
};

const zoneMapper = ({ records }) => {
  const rows = map(records, (rec) => {
    return {
      date: get(rec, 'field_1947.date_formatted'),
      zone: get(rec, 'field_1950[0].identifier'),
      bin_type: get(rec, 'field_1946')
    };
  });

  return { rows };
};

module.exports = {
  sendReminders
};
