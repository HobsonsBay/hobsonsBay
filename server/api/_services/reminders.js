const { utcToZonedTime, format } = require('date-fns-tz');
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
const newsfeed = require('./newsfeed_notifications');

const {
  APPLICATION_ID,
  API_KEY,
  KNACK_API_URL,
  KNACK_BIN_DAYS_OBJECT_ID,
  KNACK_USER_CONFIGS_OBJECT_ID,
  FIREBASE_ADMIN,
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

const BIN_DAYS_OBJECT_URL = `${KNACK_API_URL}${KNACK_BIN_DAYS_OBJECT_ID}`;
const USER_CONFIGS_OBJECT_URL = `${KNACK_API_URL}${KNACK_USER_CONFIGS_OBJECT_ID}`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(FIREBASE_ADMIN))
});


const testReminders = async () => {
  //const { rows } = await getConfigs(" Wednesday Area 1", "1400", '0');

  let r = 'not active';
  //console.log(rows);

  const token = [
  // android emu
  'd1h6b_Bsbig:APA91bH_WLHdf4VF-XFuzsNd3cVGoT6ELnipDYcPArlnhYQRyMzLxFDgadlr-nNRWCNYju0iK_UpULZHJIhOA2DCk_1rTCgTq3YDpusSmFMFXbJ2j_c5ODyAZ2O79fuwmLPBVkWRQhFG',
  // alex android
  'cbQh_-lJXsE:APA91bEygfAK1-_Z9tgTUgUQopjifqtUKTSWVUKZTByIqCEutMWN2Dl6iVLwmnNoCvoDoRtXoVOm1iwhy9zzvZ8_7CDy-qlOTgBVbW27JbyguyATKuZDM4WPJJR02roni2XwbynUIqqj',
  // ios simulator
  'f-OnPF8l9E8:APA91bGZe0gskN3fvY44wkj2AoDQsw8xw8d9MuCGaMont42TIoRR4F9_cmoHyQBOzMXGYQOTS3pCSalo9FmZ4VYMgFQvgQQONdpWAz-_JaWzvLwDeSbVId0jTEUiCun_p00lLGGSmpkb',

  'd6cYOAZhkX4:APA91bE2npEEMus9jOWSbMJ1a_mOJytHOcPjkO2UksDWFg3w35ei-e1OqaU5dj_zukRYIxAdyAp29CvNQA8HOdOv4fPije9R282tZkd4yl4WOpKFSlmkI9T-Ly9MfXgUihZNg0d0wxMw',
  // dev iPhone
  'f27l5WV8TQk:APA91bGIk9LM33aXQ1aOVMTtNOc09FmWk05YZxOtkllB6oIUD17VkXAotkC-PVmtRQ4R3xBXHJr02Jh-Lvh5F0MoUIhugMmUWIPXaWTP2lF3jL860XiFAw5MaGBEPUea5FRRb37ShcVd',
  // dev Samsung
  'd-R_CMy026Q:APA91bGZP-3O9byBbMBMVpx6phKn9yFRQybQ6SiIwFeca-ZgdFNPG7ilwhpHD-59RUCNogNQOE3g4rbwmUjzY4i6KzMhaUptjigqV8k4k4UYvo9T7K9MDnk_IWGWnlb642tuikSEZekv',
  // prod samsung
  'djf8bNVKHnc:APA91bGuXWjEY7qv-Q4p79WWkURTRiuf2p3lZGoj_MFcVogRzjvYp2GyrFEYuGwY_9a9HsBomaQDaG5r1jCQlCYQ4AOK3Nb9_n-779pHIJ5TGCf3klhn662mu0wVl4kV-fxGk4RO2XKH',
  // prod iphone
  'dmNklSl4c14:APA91bEl1J9vqtEA9HLTIm4t84OakJ98DjJxbCCBTvz18eb4arqHBidOm_i6IhuHeqF-rCU1tN3spI-9aFhrBPFaeF5wPMUw0h5wgeCQ11fWiI5Lb67oSup89m08KOoJIagFkfOWwTIH'];
  // const tokens = map(rows, (row) => row.token);
  const message = {
    title: `Test Message`,
    body: `Test message please ignore`
  }

  await admin.messaging().sendToDevice(token,
    { 
      notification: {
        title: 'Test Service Message With a Potentially Wrapping Title to Test Visuals',
        body: 'This is a test message for potential display of service related messages.\nThese messages can be cosiderably longer than the bin reminder messages and need to be displayed appropriately.',
      },
      data: {
        type: "service"
      }
    },
    {
      // Required for background/quit data-only messages on iOS
      content_available: true,
      // Required for background/quit data-only messages on Android
      priority: 'high',
    }
  ).then(function(response) {
    // See the MessagingDevicesResponse reference documentation for
    // the contents of response.
    console.log('Successfully sent message:', response);
    r = 'success';
  })
  .catch(function(error) {
    console.log('Error sending message:', error);
    r = 'error';
  });
  return r
}



/*
*   Gets rows from User Configs table based on tomorrow's day and reminder time
*   
*   Iterates over each zone and computes the Bin Message for that area,
*   Then searches for bin reminders for that area set to the current hour,
*   Stores tokens in an array and then if there are tokens,
*   step through that array 100 records at a time and send to FCM
*
*   step to next bin zone then finish.
**/

const sendReminders = async () => {

  // init vars
  const timeZone = 'Australia/Melbourne';
  const nowDate = utcToZonedTime(new Date(), timeZone);
  const hourStart = startOfHour(nowDate);
  const difference = differenceInMinutes(nowDate, hourStart);
  let hour = format(nowDate, 'HHmm', { timeZone });
  let output = {
    time: hour,
    zones: []
  }

  // run if the db reminder time is less than 1 minute
  if (difference < 1) {
    //console.log('run loop')
    // get tomorrow's zones
    const { rows } = await getZones();
    const groupedZones = groupBy(rows, 'zone');
    const zones = keys(groupedZones);
    hour = format(hourStart, 'HHmm');
  
    // loop through each current bin zone
    for (let i = 0; i < zones.length; i++) {
      //hour = 1800;
      //console.log('loop results')
      const zone = zones[i];
      const bins = groupedZones[zone];
      const message = binMessage(zone, bins);

      let page = 1;
      let results = 0;
      let tokens = [];
      let fcmSuccess = 0;
      let fcmError = 0;

      // get user configs from knack and store tokens in "tokens"
      do {
        //console.log(zone, hour, page);
        const { rows } = await getConfigsAWS(zone, hour, page);
        results = rows.length;
        // push forwards if results returned
        // add tokens to array
        if (results > 0){
          //console.log(rows)
          let tokensPage = map(rows, (row) => row.token);
          tokens.push(...tokensPage)
          //console.log(tokensPage)
        }
        ++page;
      }
      while (results >= 1);

      // TODO:
      // could be refactored to just fetching 100 records at a time from knack

      // if tokens are in array, send out notifications in batches of 100
      if(tokens.length > 0){
        //console.log(tokens)

        for ( let i = 0; i < tokens.length; i += 100){
          //console.log(`processing ${i} of ${tokens.length}`);
          let subTokens = tokens.slice(i, i + 100);
          //console.log(subTokens)
          await admin.messaging().sendToDevice(subTokens,
          //await testSend(subTokens,
            { 
              notification: { ...message },
              data: {
                type: "reminder"
              } 
            }
          ).then(function(response) {
            console.log('Successfully sent messages:', response);
            output.success = "Successfully sent messages";
            fcmSuccess += response.successCount;
            fcmError += response.failureCount;
          })
          .catch(function(error) {
            console.log('Error sending message:', error);
            output.error = "firebase send error"
          });
        }

      }else{
        console.log('no reminders sent')
      }

      // add info to output
      output.zones.push({ name:zones[i], sent: fcmSuccess, unsent: fcmError });
    }

  }else{
    output.error = "time difference error"
    console.log('time difference error: '+hour)
  }
  //console.log('end fetch')
  return output
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


/// below is the old send function. can be removed, but kept for reference
const fetchReminders = async () => {
  console.log('start')
  // init vars
  const timeZone = 'Australia/Melbourne';
  const nowDate = utcToZonedTime(new Date(), timeZone);
  const hourStart = startOfHour(nowDate);
  const difference = differenceInMinutes(nowDate, hourStart);
  let hour = format(nowDate, 'HHmm', { timeZone });

  // run if the db reminder time is less than 1 minute
  if (difference < 1) {
    console.log('run loop')
    // get tomorrow's zones
    const { rows } = await getZones();
    const groupedZones = groupBy(rows, 'zone');
    const zones = keys(groupedZones);
    hour = format(hourStart, 'HHmm');
    
    // loop through zones and generate bin message
    for (let i = 0; i < zones.length; i++) {
      console.log('set messages')
      const zone = zones[i];
      const bins = groupedZones[zone];
      const message = binMessage(zone, bins);

      let page = 1;
      let results = [];
      do {
        // fetch all tokens for current zone
        console.log('get tokens and send message')
        const { rows } = await getConfigs(zone, hour, page);
        results = rows;
        const tokens = map(rows, (row) => row.token);
        // await admin.messaging().sendToDevice(tokens,
        //   { notification: { ...message } }
        // );
        ++page;
      }
      while (results.length >= 1000);
      console.log('end messages')
    }
    console.log('end loop')
  }else{
    console.log('loop not run')
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
  //console.log(QUERY);
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options).then((response) => response.json());
  //console.log(json);
  return configMapper(json);
};

const getConfigsAWS = async (zone, hour, page) => {

  const pageNum = (page-1) * 1000;

  const queryStr = `SELECT id, token, zone, time, type_reminder, type_service FROM user_configs WHERE zone='${zone}' AND time='${hour}' AND type_reminder=true LIMIT ${pageNum},1000;`;
  result = await mysql.query(queryStr);
  await mysql.end();

  return {rows:result};
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
  sendReminders,
  testReminders,
  fetchReminders,
  getConfigsAWS
};
