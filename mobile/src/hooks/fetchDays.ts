/* global fetch */
import slice from 'lodash/slice';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import {sortBins} from '../utils';
const {API_URL} = require('../config/api');
import {Alert} from 'react-native';

interface Schedule {
  date: string;
  bins: any[];
}

interface ScheduleData {
  note: string;
  area: string;
  day: string;
  days: Schedule[];
}

const processSchedule = async (rows: any[]): Promise<Schedule[]> => {
  // const {note} = rows[0];
  // const data: ScheduleData = {note, area: '', day: '', days: []};
  const grouped = groupBy(rows, 'date');
  const mapped = map(grouped, (value, key) => ({
    date: key,
    bins: sortBins(value),
  }));
  const sliced = mapped.length > 4 ? slice(mapped, 0, 4) : mapped;
  return sliced;
};

const getAddress = async (asn: string): Promise<ScheduleData> => {
  const ADDRESS_URL = `${API_URL}/addresses?asn=${asn}`;
  const data: ScheduleData = {note: '', area: '', day: '', days: []};
  try {
    const res = await fetch(ADDRESS_URL);
    const {rows} = await res.json();
    const {day, area} = rows[0];
    data.area = area;
    data.day = day;
    const SCHEDULES_URL = `${API_URL}/schedules?area=${area}&day=${day}`;
    const res2 = await fetch(SCHEDULES_URL);
    const {rows: rows2} = await res2.json();
    data.days = await processSchedule(rows2);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const fetchDays = async (asn?: string): Promise<ScheduleData> => {
  const data: ScheduleData = {note: '', area: '', day: '', days: []};
  if (asn && data.day === '') {
    try {
      const {days} = await getAddress(asn);
      data.days = days;
      return data;
    } catch (error) {
      Alert.alert('A network error occurred. Please try again later');
      return Promise.reject(error);
    }
  }
  return data;
};

export default fetchDays;
