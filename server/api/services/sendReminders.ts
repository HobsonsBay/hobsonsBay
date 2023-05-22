import { differenceInMinutes, format, startOfHour } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { join, map, get, groupBy, keys } from "lodash";
var admin = require("firebase-admin");
var fetch = require("isomorphic-fetch");
import enAU from "date-fns/locale/en-AU";
import { formatBinName } from "../utils";
const {
  APPLICATION_ID,
  API_KEY,
  KNACK_API_URL,
  KNACK_BIN_DAYS_OBJECT_ID,
  KNACK_USER_CONFIGS_OBJECT_ID,
} = process.env;

const BIN_DAYS_OBJECT_URL = `${KNACK_API_URL}${KNACK_BIN_DAYS_OBJECT_ID}`;
const USER_CONFIGS_OBJECT_URL = `${KNACK_API_URL}${KNACK_USER_CONFIGS_OBJECT_ID}`;

var serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const                                                                                                                                                       sendReminders = async () => {
  const timeZone = "Australia/Melbourne";
  const nowDate = utcToZonedTime(new Date(), timeZone);
  const hourStart = startOfHour(nowDate);
  const difference = differenceInMinutes(nowDate, hourStart);
  let hour = format(nowDate, "HHmm", { locale: enAU });
  let output = {
    time: hour,
    zones: [],
  };
  //   if(difference === 0){
  const { rows } = await getZones();
  const groupedZones = groupBy(rows, "zone");
  const zones = keys(groupedZones);
  hour = format(hourStart, "HHmm");
  for (const element of zones) {
    const bins = groupedZones[element];
    const message = binMessage(element, bins);

    const { rows } = await getUsers(element, hour);
    for (let i = 0; i < rows.length; i += 100) {
      const batch = rows.slice(i, i + 100).map((object)=>object["token"]);
      
      await admin
        .messaging()
        .sendToDevice(batch, {
          notification: { ...message },
          data: { type: "reminder" },
        })
        .then(function (response) {
          // output.success = "Successfully sent messages";
          // fcmSuccess += response.successCount;
          // fcmError += response.failureCount;
        })
        .catch(function (error) {
          console.log("Error sending message:", error);
          // output.error = "firebase send error";
        });
    }
  }
  return output;
};
const binMessage = (zone, bins) => {
  const binNames = map(bins, (bin) => formatBinName(bin.bin_type));
  const day = zone.split(" ")[0];
  return {
    title: `Your bin collection day is tomorrow, ${day}`,
    body: `Please have your ${binNames.join(
      ", "
    )} bins out on the nature strip by 5am.`,
  };
};

const getUsers = async (zone, hour) => {
  
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
        field: "field_2219",
        operator: "is",
        value: zone,
      },
      {
        field: "field_2221",
        operator: "is",
        value: hour,
      },
      {
        field: "field_5341",
        operator: "is",
        value: "True",
      },
    ],
  };
  const query = {
    sort_order: "asc",
    filters: encodeURIComponent(JSON.stringify(filters)),
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

const getZones = async () => {
  const RECORDS_URL = `${BIN_DAYS_OBJECT_URL}/records`;
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
        field: "field_1943",
        operator: "is",
        value: false,
      },
      {
        field: "field_1947",
        operator: "is during the next",
        range: 1,
        type: "days",
      },
    ],
  };
  const query = {
    page: 1,
    rows_per_page: 15,
    format: "raw",
    sort_field: "field_1951",
    sort_order: "asc",
    filters: encodeURIComponent(JSON.stringify(filters)),
  };

  const QUERY = join(
    map(query, (value, key) => `${key}=${value}`),
    "&"
  );
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options).then(
    (response) => response.json()
  );

  return zoneMapper(json);
};
const configMapper = ({ records }) => {
  const rows = map(records, (rec) => {
    return {
      token: get(rec, "field_2218"),
    };
  });

  return { rows };
};

const zoneMapper = ({ records }) => {
  const rows = map(records, (rec) => {
    return {
      date: get(rec, "field_1947.date_formatted"),
      zone: get(rec, "field_1950[0].identifier"),
      bin_type: get(rec, "field_1946"),
    };
  });

  return { rows };
};

export { sendReminders };
