/* global fetch */
import slice from 'lodash/slice';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import {useState, useEffect, useCallback} from 'react';
import {sortBins} from '../utils';
const {API_URL} = require('../config/api');

interface ScheduleData {
  area: string;
  day: string;
  note: string;
  days: {date: string; bins: any[]}[];
}

// const API_URL = 'http://example.com/api';

const useScheduleData = (asn: string) => {
  const [data, setData] = useState<ScheduleData>({
    area: '',
    day: '',
    note: '',
    days: [],
  });

  const processSchedule = useCallback((rows: any[]) => {
    // const {note} = rows[0];
    const grouped = groupBy(rows, 'date');
    const mapped = map(grouped, (value, key) => ({
      date: key,
      bins: sortBins(value),
    }));
    return mapped.length > 4 ? slice(mapped, 0, 4) : mapped;
  }, []);

  const getAddress = useCallback(
    async (asn: string) => {
      const ADDRESS_URL = `${API_URL}/addresses?asn=${asn}`;
      try {
        const res = await fetch(ADDRESS_URL);
        const {rows} = await res.json();
        const {day, area} = rows[0];
        const SCHEDULES_URL = `${API_URL}/schedules?area=${area}&day=${day}`;
        const schedulesRes = await fetch(SCHEDULES_URL);
        const {rows: scheduleRows} = await schedulesRes.json();
        const days = processSchedule(scheduleRows);
        setData({...data, area, day, days});
      } catch (error) {
        console.error('Error getting address', error);
      }
    },
    [data, processSchedule],
  );

  useEffect(() => {
    if (asn && data.day === '') {
      getAddress(asn);
    }
  }, [asn, data.day, getAddress]);

  return [data];
};

export default useScheduleData;
