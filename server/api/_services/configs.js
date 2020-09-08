const fetch = require('isomorphic-fetch');
const get = require('lodash/get');
const map = require('lodash/map');
const join = require('lodash/join');
const util = require( 'util' );
//const mysql = require('mysql');
const {
  APPLICATION_ID,
  API_KEY,
  KNACK_API_URL,
  KNACK_USER_CONFIGS_OBJECT_ID,
  AWS_MYSQL_URL,
  AWS_MYSQL_USER,
  AWS_MYSQL_PASS
} = process.env;

const config = {
  host     : AWS_MYSQL_URL,
  user     : AWS_MYSQL_USER,
  password : AWS_MYSQL_PASS,
  database : 'R20_user_configs'
}

const mysql = require('serverless-mysql')({config})

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

const remove_duplicates = async (token) => {
  // quick check to see if id is mysql or agility

  const queryStr = `DELETE FROM \`user_configs\` WHERE token = ?;`;
  const resp = await mysql.query(queryStr,[token]);
  return resp;  
}


const get_mysql = async (id) => {
  // return object of id, token, zone, time, type_reminder, type_service from the database.
  // runs after post and put requests to return info for app config object

  // quick check to see if id is mysql or agility
  const idQuery = (parseInt(id) == id) ? "id" : "k_id";

  const queryStr = `SELECT id, token, zone, time, type_reminder, type_service from user_configs where ${idQuery} = ?;`;
  result = await mysql.query(queryStr,[id]);
  await mysql.end();
  return result[0];
}

const post_mysql = async (payload) => {
  
  // post query to add a new row to the database
  // fires when an app user turns on notifications without a saved config in the app
  const properties = {
    token : payload.token,
    zone : payload.zone,
    time : payload.time,
    type_reminder : (payload.type_reminder != undefined) ? payload.type_reminder : true,
    type_service : (payload.type_service != undefined) ? payload.type_service : false,
  }

  await remove_duplicates(properties.token);
  const queryStr = `INSERT INTO user_configs SET`+mysql.escape(properties)+";";
  const post = await mysql.query(queryStr);
  const result = await get_mysql(post.insertId);
  await mysql.end();
  return result;
}

const put_mysql = async (id, payload) => {
  
  // put query to update an existing row in the database
  // fires when an app user changes the time in their app
  const properties = {
    token : payload.token,
    zone : payload.zone,
    time : payload.time,
    type_reminder : (payload.type_reminder != undefined) ? payload.type_reminder : true,
    type_service : (payload.type_service != undefined) ? payload.type_service : false,
  }

  // quick check to see if id is mysql or agility
  const idQuery = (parseInt(id) == id) ? "id" : "k_id";

  const queryStr = `UPDATE user_configs SET`+mysql.escape(properties)+` WHERE ${idQuery} = ?;`;
  const post = await mysql.query(queryStr,[id]);
  const result = await get_mysql(id);
  await mysql.end();
  return result;
}


const delete_mysql = async (id) => {
  // deletes a user configuration from the database
  // will only run if the user has turned off both reminder and service notifications

  // quick check to see if id is mysql or agility
  const idQuery = (parseInt(id) == id) ? "id" : "k_id";

  const queryStr = `DELETE FROM \`user_configs\` WHERE ${idQuery} = ?;`;
  const resp = await mysql.query(queryStr,[id]);
  // return true/false for whether row was deleted
  const result = { delete : resp.affectedRows == 1 }
  await mysql.end();
  return result;
}


const testMysql = async (id, query) => {

  let result;
  console.log(id, query);

  result = await put_mysql(id, query)
  
  console.log(result)

  return result
}



/***********************OLD FUCTIONS BELOW**************************/



// post initial config and return ID
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


// update existing config
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

// return existing config based on ID
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

// Remove config from database
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

// check to see if there are multiple configs in the database
const getTokens = async (token) => {
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
        field: 'field_2218',
        operator: 'is',
        value: token
      }
    ]
  };
  const query = {
    page: 1,
    rows_per_page: 1000,
    format: 'raw',
    filters: encodeURIComponent(JSON.stringify(filters))
  };
  const QUERY = join(map(query, (value, key) => `${key}=${value}`), '&');
  console.log('fetch');
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options)
    .then((response) => response.json())

  console.log('records');
  const ids = []
  if (json.records.length > 0){
    ids = json.records.map(id => id.id);
    console.log(ids);
  }
  return ids;
}

const getDb = async () => {
  const RECORDS_URL = `${USER_CONFIGS_OBJECT_URL}/records`;
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
  };
  const QUERY = join(map(query, (value, key) => `${key}=${value}`), '&');
  console.log('fetch');
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options)
    .then((response) => response.json())

  csvOut = '"k_id","token","zone","time"\n'
  json.records.forEach((key,idx) => {
    //console.log(key.id)
    // 1,"**********0:APA91bGaU70LoC23DZ8A6FaCXix8fixad7IUBvoPamsRg-WDGOwfCniKLymAaZbII524VhtR_SRdOpgMiQ3nzhjQwHwZqCTz6j50bbwv_HIAHHm_F5e2fx_HYbIp1AvMLT5tsUV1VLc_"," Thursday Area 3","18:00:00"
    csvOut += `"${key.id}","${key.field_2218}","${key.field_2219}","${key.field_2221}"\n`;
  })
  console.log(csvOut)
  return csvOut
}

  

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
  deleteConfig,
  getTokens,
  getDb,
  testMysql,
  get_mysql,
  post_mysql,
  delete_mysql,
  put_mysql
};
