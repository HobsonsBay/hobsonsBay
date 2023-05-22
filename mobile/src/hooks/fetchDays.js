/* global fetch */
import slice from 'lodash/slice';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import { sortBins } from '../utils';
import Config from 'react-native-config'
export default async (asn) => {
  let data ={ area: '', day: '', days: [] };

  const processSchedule = async (rows) => {
    const { note } = rows[0];
    data.note = note;
    const grouped = groupBy(rows, 'date');
    const mapped = map(grouped, (value, key) => ({ date: key, bins: sortBins(value) }));
    return mapped.length > 4 ? slice(mapped, 0, 4) : mapped;
  };
  
  const getAddress = async (asn) => {
    const ADDRESS_URL = `${Config.API_URL}/addresses?asn=${asn}`;
    return fetch(ADDRESS_URL)
      .then((res) => res.json())
      .then(({ rows }) => {
        const { day, area } = rows[0];
        data.area = area;
        data.day = day;
        const SCHEDULES_URL = `${Config.API_URL}/schedules?area=${area}&day=${day}`;
        return fetch(SCHEDULES_URL);
      })
      .then((res) => res.json())
      .then(({ rows }) => {
        return processSchedule(rows);
      })
      .catch((error) => {
        return Promise.reject(error)
      });
  };

  if (asn && data.day === '') {
    await getAddress(asn)
      .then((days) => data = { ...data, days })
      .catch((error) => {
        alert('A network error occurred. Please try again later');
        return Promise.reject(error)
      });
  }

  return data;
};
