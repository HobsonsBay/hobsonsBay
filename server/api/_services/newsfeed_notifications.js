const fetch = require('isomorphic-fetch');
const join = require('lodash/join');
const map = require('lodash/map');
const admin = require('firebase-admin');
const { utcToZonedTime, format } = require('date-fns-tz');
const startOfHour = require('date-fns/startOfHour');
const formatISO = require('date-fns/formatISO');
const differenceInHours = require('date-fns/differenceInHours')

const {
  APPLICATION_ID,
  API_KEY,
  KNACK_API_URL,
  KNACK_BIN_DAYS_OBJECT_ID,
  KNACK_USER_CONFIGS_OBJECT_ID,
  KNACK_NEWSFEED_OBJECT_ID,
  FIREBASE_ADMIN,
  AWS_MYSQL_URL,
  AWS_MYSQL_USER,
  AWS_MYSQL_PASS
} = process.env;


const fields = {
  deleted : 'field_2705',
  status : 'field_2701',
  sent : 'field_2713',
  live : 'field_2700',
  time : 'field_2699'
}

const config = {
  host     : AWS_MYSQL_URL,
  user     : AWS_MYSQL_USER,
  password : AWS_MYSQL_PASS,
  database : 'R20_user_configs'
};

const mysql = require('serverless-mysql')({config});

const NEWSFEED_OBJECT_URL = `${KNACK_API_URL}${KNACK_NEWSFEED_OBJECT_ID}`;

/* this is the function to get the newsfeed from AWS 

*/
const getNewsfeed = async (page) => {
  const rows = 10
  const pageNum = (page-1) * rows;
  const query = `SELECT * FROM newsfeed ORDER BY id DESC LIMIT ${rows} OFFSET ${pageNum};`
  const newsfeed = await mysql.query(query);
  await mysql.end();
  return newsfeed
}


/* This is the main function 
  It checks agility for scheduled posts,
  Sends them to the mysql newsfeed
  updates agility with a 'sent' parameter
  gets zone tokens from mysql
  returns an array of push notifications to be sent
  and tokens to be sent to
*/

const newsfeed = async () =>{

  let mysql_out = []

  // fetch notifcations/newsfeed from agility
  const records = await fetch_agility();

  // run if there are newsfeed items to process
  if (records.length > 0){
    for(post of records){

      const zones = zone(post.field_2707);

      // push newsfeed to AWS
      const push_newsfeed = await push_to_mysql({
        time: post.field_2699.iso_timestamp,
        title: post.field_2698,
        body: post.field_2710 ,
        link_text: post.field_2711.label ,
        link_url:  post.field_2711.url ,
        type:  post.field_2712 ,
        zones: (post.field_2708 == true) ? "[\"all\"]" : JSON.stringify(zones)
      });

      // update agility status
      let response = await update_status(post.id);

      // get tokens to send push notifications to
      const tokens = await getTokensAWS(zones,1);
      mysql_out.push({
        status:'success',
        notification:{
          title:post.field_2698,
          body:post.field_2709
        },
        data: {
          type: "service"
        },
        tokens: tokens.rows
      });
    }
    await mysql.end();

    const send_status = await sendPushNotifications(mysql_out);

    return [{'status':send_status}];
  }else{
    return [{'status':'no messages to send'}];
  }
}

const fetch_agility = async () => {
/*
  Fetch newsfeed posts from Agility with the following conditions:
  deleted = false
  sent = false
  status = approved
  live = yes
  */

  /*
  "time": {
      "date": "08/31/2020",
      "date_formatted": "08/31/2020",
      "hours": "12",
      "minutes": "00",
      "am_pm": "AM",
      "unix_timestamp": 1598832000000,
      "iso_timestamp": "2020-08-31T00:00:00.000Z",
      "timestamp": "08/31/2020 12:00 am",
      "time": 720
  },
  */
  const timeZone = 'Australia/Melbourne';
  const nowDate = utcToZonedTime(new Date(),timeZone);
  const hourStart = startOfHour(nowDate);
  let hour = format(hourStart, 'MM/dd/yyyy hh:mm aa', { timeZone });

  const RECORDS_URL = `${NEWSFEED_OBJECT_URL}/records`;
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
        field: fields.deleted,
        operator: 'is',
        value: "No"
      },
      // {
      //   field: fields.sent,
      //   operator: 'is',
      //   value: "No"
      // },
      {
        field: fields.status,
        operator: 'is',
        value: "Approved"
      },
      {
        field: fields.time,
        operator: "is today"
      }
    ]
  };
  const query = {
    page: 1,
    rows_per_page: 10,
    format: 'raw',
    filters: encodeURIComponent(JSON.stringify(filters))
  };

  const QUERY = join(map(query, (value, key) => `${key}=${value}`), '&');
  let output = await fetch(`${RECORDS_URL}?${QUERY}`, options).then((response) => response.json());
  
  // filter output based on hour extracted from post matched against current time.
  const dateLocal = startOfHour(utcToZonedTime(new Date(),timeZone));

  let filtered = output.records.filter((post) => {
    const dateServer = utcToZonedTime(new Date(post.field_2699.unix_timestamp));
    console.log(dateServer,dateLocal);
    return dateServer.getHours() == dateLocal.getHours();
  })

  return filtered;
}

const zone = (zones) => {
  let output =[];
  zones.forEach((zone,index)=>{
    output.push(zone.identifier);
  })
  return output
}

const update_status = async (id) => {
  const RECORDS_URL = `${NEWSFEED_OBJECT_URL}/records`;
  const options = {
    method: 'PUT',
    body: JSON.stringify({
      field_2713: "Yes",
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-Knack-Application-Id': APPLICATION_ID,
      'X-Knack-REST-API-KEY': API_KEY
    }
  };
  const json = await fetch(`${RECORDS_URL}/${id}`, options).then((response) => response.json());
  return json;
}

const push_to_mysql = async (post) => {
  
  // post query to add a new row to the database
  // fires when a push notification is sent and the newsfeed item is ready to be submitted

  const queryStr = `INSERT INTO newsfeed SET ${mysql.escape(post)};`;
  post = await mysql.query(queryStr);

  return true;

}

const getTokensAWS = async (zones, page) => {

  const pageNum = (page-1) * 1000;

  const queryStr = `SELECT token, zone, type_service FROM user_configs WHERE zone in(${mysql.escape(zones)}) AND type_service=true LIMIT ${pageNum},1000;`;
  //const queryStr = `SELECT token FROM user_configs WHERE zone in(${mysql.escape(zones)}) LIMIT ${pageNum},10000;`;
  let result = [];
  tokens = await mysql.query(queryStr);
  for (token of tokens){
    //console.log(token);
    result.push(token.token);
  }
  return {rows:result};
};

const sendPushNotifications = async (messages) => {
  let fcmSuccess = 0;
  let fcmError = 0;
  let output = {};
  for (message of messages){
    if (message.tokens.length > 0){

      /*
      // TODO implement batching of notification sends


      if(tokens.length > 0){
        //console.log(tokens)

        for ( let i = 0; i < tokens.length; i += 100){
          //console.log(`processing ${i} of ${tokens.length}`);
          let subTokens = tokens.slice(i, i + 100);
          */



      await admin.messaging().sendToDevice(message.tokens,{
      //await testSend(message.tokens,{
        notification : message.notification,
        data : message.data
      }).then(function(response) {
        console.log('Successfully sent messages:', response);
        output.success = "Successfully sent messages";
        fcmSuccess += response.successCount;
        fcmError += response.failureCount;
      })
      .catch(function(error) {
        console.log('Error sending message:', error);
        output.error = "firebase send error"
      });





    }else{

    }
  }
  return output;
}


const testSend = async (tokens, notification) => {
  console.log('dummy output func')
  console.log(tokens);
  console.log(notification);
  return {
    successCount: 420,
    failureCount: 69
  }
}

module.exports = {
  newsfeed,
  getNewsfeed
};