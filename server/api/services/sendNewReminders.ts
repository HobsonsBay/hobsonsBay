import { utcToZonedTime, format } from "date-fns-tz";
import { startOfHour } from "date-fns";
import { join, map, get, groupBy, keys } from "lodash";
var fetch = require("isomorphic-fetch");
var admin = require("firebase-admin");

const {
  APPLICATION_ID,
  API_KEY,
  KNACK_API_URL,
  KNACK_BIN_DAYS_OBJECT_ID,
  KNACK_USER_CONFIGS_OBJECT_ID,
  KNACK_NEWSFEED_OBJECT_ID,
  FIREBASE_ADMIN,
} = process.env;
const NEWSFEED_OBJECT_URL = `${KNACK_API_URL}${KNACK_NEWSFEED_OBJECT_ID}`;
var serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const fields = {
  deleted: "field_2705",
  status: "field_2701",
  sent: "field_2713",
  live: "field_2700",
  time: "field_2699",
};
const fetchNews = async () => {
  const timeZone = "Australia/Melbourne";
  const nowDate = utcToZonedTime(new Date(), timeZone);
  const hourStart = startOfHour(nowDate);
  let hour = format(hourStart, "MM/dd/yyyy hh:mm aa", { timeZone });

  const RECORDS_URL = `${NEWSFEED_OBJECT_URL}/records`;
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
        field: fields.deleted,
        operator: "is",
        value: "No",
      },
      {
        field: fields.sent,
        operator: "is",
        value: "No",
      },
      {
        field: fields.status,
        operator: "is",
        value: "Approved",
      },
      {
        field: fields.time,
        operator: "is today",
      },
    ],
  };
  const query = {
    page: 1,
    rows_per_page: 10,
    format: "raw",
    filters: encodeURIComponent(JSON.stringify(filters)),
  };

  const QUERY = join(
    map(query, (value, key) => `${key}=${value}`),
    "&"
  );
  let output = await fetch(`${RECORDS_URL}?${QUERY}`, options).then(
    (response) => response.json()
  );

  // filter output based on hour extracted from post matched against current time.
  const dateLocal = utcToZonedTime(new Date(), timeZone);
  const ausTimeZone = "Australia/Sydney";
  let filtered = output.records.filter((post) => {
    const convertedTime = new Date(
      post.field_2699.unix_timestamp
    ).getUTCHours();

    return convertedTime == dateLocal.getHours();
  });

  return filtered;
};

const newsAlertReminder = async () => {
  const records = await fetchNews();
  const notificationData = [];
  if (records.length !== 0) {
    for (const news of records) {
      const zones = zone(news.field_2707);
      const { rows } = await getUsers(zones);

      notificationData.push({
        status: "success",
        notification: {
          title: news.field_2698,
          body: news.field_2709,
        },
        data: {
          type: "service",
        },
        tokens: rows,
      });
    }
    const send_status = await sendPushNotifications(notificationData);
    return [{ status: send_status }];
  }
  return records;
};
const sendPushNotifications = async (messages) => {
  let fcmSuccess = 0;
  let fcmError = 0;
  let output = {};
  for (const message of messages) {
    if (message.tokens.length > 0) {
      /*
        // TODO implement batching of notification sends
  
  
        if(tokens.length > 0){
          //console.log(tokens)
  
          for ( let i = 0; i < tokens.length; i += 100){
            //console.log(`processing ${i} of ${tokens.length}`);
            let subTokens = tokens.slice(i, i + 100);
            */

      await admin
        .messaging()
        .sendToDevice(
          message.tokens.map((object) => object["token"]),
          {
            //await testSend(message.tokens,{
            notification: message.notification,
            data: message.data,
          }
        )
        .then(function (response) {
        
          //   output.success = "Successfully sent messages";
          //   fcmSuccess += response.successCount;
          //   fcmError += response.failureCount;
        })
        .catch(function (error) {
          //   output.error = "firebase send error";
        });
    } else {
    }
  }
  return output;
};
const zone = (zones) => {
  let output = [];
  zones.forEach((zone, index) => {
    output.push(zone.identifier);
  });
  return output;
};

const USER_CONFIGS_OBJECT_URL = `${KNACK_API_URL}${KNACK_USER_CONFIGS_OBJECT_ID}`;
const getUsers = async (zones) => {
  const RECORDS_URL = `${USER_CONFIGS_OBJECT_URL}/records`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Knack-Application-Id": APPLICATION_ID,
      "X-Knack-REST-API-KEY": API_KEY,
    },
  };
  const updatedZones = zones.map((element) => "field_2219=" + element);
  var filterQuery = "(";
  for (let i = 0; i < updatedZones.length; i++) {
    if (i !== 0) {
      filterQuery += " OR ";
    }

    filterQuery += updatedZones[i];
  }
  filterQuery += ")";
  filterQuery += "OR field_5341=True";
  const query = {
    sort_order: "asc",
    filters: encodeURIComponent(JSON.stringify(filterQuery)),
  };
  const QUERY = join(
    map(query, (value, key) => `${key}=${value}`),
    "&"
  );
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options).then(
    (response) => response.json()
  );

  return configMapper(json);
};
const configMapper = ({ records }) => {
  const rows = map(records, (rec) => {
    return {
      token: get(rec, "field_2218"),
    };
  });

  return { rows };
};

const update_status = async (id) => {
  const RECORDS_URL = `${NEWSFEED_OBJECT_URL}/records`;
  const options = {
    method: "PUT",
    body: JSON.stringify({
      field_2713: "Yes",
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
  return json;
};

export { newsAlertReminder };
