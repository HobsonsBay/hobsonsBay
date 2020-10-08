const fetch = require('isomorphic-fetch');
const join = require('lodash/join');
const map = require('lodash/map');
const get = require('lodash/get');
const admin = require('firebase-admin');
const { utcToZonedTime, format } = require('date-fns-tz');
const startOfHour = require('date-fns/startOfHour');
const formatISO = require('date-fns/formatISO');
const differenceInHours = require('date-fns/differenceInHours')

const {
  APPLICATION_ID,
  API_KEY,
  KNACK_API_URL,
  KNACK_TIPS_CATEGORIES_OBJECT_ID,
  KNACK_TIPS_OBJECT_ID,
  KNACK_STATS_OBJECT_ID,
  AWS_MYSQL_URL,
  AWS_MYSQL_USER,
  AWS_MYSQL_PASS
} = process.env;


// const fields = {
//   deleted : 'field_2705',
//   status : 'field_2701',
//   sent : 'field_2713',
//   live : 'field_2700',
//   time : 'field_2699'
// }

const config = {
  host     : AWS_MYSQL_URL,
  user     : AWS_MYSQL_USER,
  password : AWS_MYSQL_PASS,
  database : 'R20_user_configs'
};

const mysql = require('serverless-mysql')({config});

const getStats = async () => {

  const RECORDS_URL = `${KNACK_API_URL}${KNACK_STATS_OBJECT_ID}/records`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Knack-Application-Id': APPLICATION_ID,
      'X-Knack-REST-API-KEY': API_KEY
    }
  };
  const query = {
    page: 1,
    rows_per_page: 1000,
    format: 'raw',
    // sort_field: "field_2957",
    // sort_order: "asc"
    //filters: encodeURIComponent(JSON.stringify(filters))
  };

  const QUERY = join(map(query, (value, key) => `${key}=${value}`), '&');
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options).then((response) => response.json());
  return fieldMapperStats(json).rows;
}

/*
"id": "5f7bab0c34ad9129485acf01",
                "field_2921": "Rubbish",
                "field_2922": "In the first four months of Recycling 2.0, we saved an estimated 2,500 tons more from landfill.  \n \nThat’s enough to cover the Altona pier 2 metres deep.",
                "field_2923": "down",
*/
const fieldMapperStats = ({ records }) => {
  const rows = map(records, (rec) => {

    return {
      id: get(rec, 'id'),
      type: get(rec, 'field_2921'),
      stat: get(rec, 'field_2922'),
      indicator: get(rec, 'field_2923'),
    };
  });

  return { rows };
};


const getTipCats = async () => {

  const RECORDS_URL = `${KNACK_API_URL}${KNACK_TIPS_CATEGORIES_OBJECT_ID}/records`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Knack-Application-Id': APPLICATION_ID,
      'X-Knack-REST-API-KEY': API_KEY
    }
  };
  const query = {
    page: 1,
    rows_per_page: 1000,
    format: 'raw',
    // sort_field: "field_2957",
    // sort_order: "asc"
    //filters: encodeURIComponent(JSON.stringify(filters))
  };

  const QUERY = join(map(query, (value, key) => `${key}=${value}`), '&');
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options).then((response) => response.json());
  return fieldMapperTipCats(json).rows;
}


const fieldMapperTipCats = ({ records }) => {
  const rows = map(records, (rec) => {

    return {
      id: get(rec, 'id'),
      name: get(rec, 'field_2916'),
      colour: get(rec, 'field_2917'),
    };
  });

  return { rows };
};


const getTips = async (id) => {

  const RECORDS_URL = `${KNACK_API_URL}${KNACK_TIPS_OBJECT_ID}/records`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Knack-Application-Id': APPLICATION_ID,
      'X-Knack-REST-API-KEY': API_KEY
    }
  };
  const query = {
    page: 1,
    rows_per_page: 1000,
    format: 'raw',
    //filters: encodeURIComponent(JSON.stringify(filters))
  };

  const QUERY = join(map(query, (value, key) => `${key}=${value}`), '&');
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options).then((response) => response.json());
  return fieldMapperTips(json).rows;
}


const fieldMapperTips = ({ records }) => {

  const rows = map(records, (rec) => {

    return {
      id: get(rec, 'id'),
      category: get(rec, 'field_2886[0].identifier', null),
      title: get(rec, 'field_2887'),
      tip: get(rec, 'field_2888'),
      credit: get(rec, 'field_2954'),
      did_you_know: get(rec, 'field_2889'),
    };
  });

  return { rows };
};




const getTipsStats = async () => {
  //https://api.knack.com/v1/pages/scene_xx/views/view_yy/records
  const RECORDS_URL = `${KNACK_API_URL}scene_892/records`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Knack-Application-Id': APPLICATION_ID,
      'X-Knack-REST-API-KEY': API_KEY
    }
  };
  const query = {
    page: 1,
    rows_per_page: 1000,
    format: 'raw',
    //filters: encodeURIComponent(JSON.stringify(filters))
  };

  const QUERY = join(map(query, (value, key) => `${key}=${value}`), '&');
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options).then((response) => response.json());
  return fieldMapperTips(json).rows;
}



module.exports = {
  getStats,
  getTipCats,
  getTips,
  getTipsStats
};