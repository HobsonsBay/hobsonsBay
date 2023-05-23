import { differenceInMinutes, format, startOfHour } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { join, map, get, groupBy, keys } from "lodash";

var fetch = require("isomorphic-fetch");
const fields = {
  deleted: "field_2705",
  status: "field_2701",
  sent: "field_2713",
  live: "field_2700",
  time: "field_2699",
};
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

const fieldType = {
  body: "field_2710",
  id: "id",
  link_text: "field_2711.label",
  link_url: "field_2711.url",
  time: "field_2699.iso_timestamp",
  title: "field_2698",
  type: "field_2712",
  zones: "field_2707",
};
const getNewsfeed = async (page) => {
  const RECORDS_URL = `${NEWSFEED_OBJECT_URL}/records`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Knack-Application-Id": APPLICATION_ID,
      "X-Knack-REST-API-KEY": API_KEY,
    },
  };
  // const australiaTime = new Date().toLocaleString("en-US", {
  //   timeZone: "Australia/Sydney",
  // });
  const currentDate = new Date();
  const filters = {
    match: "and",
    rules: [
      {
        field: fields.deleted,
        operator: "is",
        value: "No",
      },

      {
        field: fields.status,
        operator: "is",
        value: "Approved",
      },
    ],
  };
  const query = {
    page: page,
    rows_per_page: 15,
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

  return configMapper(output).sort((a, b) => {
    const dateA = new Date(a.createdDate);
    const dateB = new Date(b.createdDate);

    return dateB.getTime() - dateA.getTime();
  });
};

const configMapper = ({ records }) => {
  const options = { timeZone: "Australia/Sydney" };
  const currentDate = new Date();
  const rows = map(records, (rec) => {
    const zones = zone(rec.field_2707);
    return {
      time: new Date(rec.field_2699.unix_timestamp-1000*60*60*10),
      dateTimestamp: rec.field_2699.timestamp,
      title: rec.field_2698,
      body: rec.field_2710,
      link_text: rec.field_2711.label,
      link_url: rec.field_2711.url,
      type: rec.field_2712,
      id: rec.id,
      createdDate: rec.field_2703.iso_timestamp,
      zones: rec.field_2708 == true ? '["all"]' : JSON.stringify(zones),
    };
  })

  return rows;
};
const zone = (zones) => {
  let output = [];
  zones.forEach((zone, index) => {
    output.push(zone.identifier);
  });
  return output;
};
export { getNewsfeed };
