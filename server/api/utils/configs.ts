import { join, map, get, groupBy, keys } from "lodash";
var fetch = require("isomorphic-fetch");

const {
  APPLICATION_ID,
  API_KEY,
  KNACK_API_URL,
  KNACK_BIN_DAYS_OBJECT_ID,
  KNACK_USER_CONFIGS_OBJECT_ID,
} = process.env;
const USER_CONFIGS_OBJECT_URL = `${KNACK_API_URL}${KNACK_USER_CONFIGS_OBJECT_ID}`;
const getUsers = async (filters) => {
  
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
const configMapper = ({ records }) => {
  const rows = map(records, (rec) => {
    return {
      token: get(rec, "field_2218"),
    };
  });

  return { rows };
};

export {getUsers}