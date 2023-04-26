import map from 'lodash/map';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {formatDate, formatDay} from '../../utils';
import Bin from './Bin';

interface IDay {
  day: string;
  row: {
    date: string;
    bins: Array<{
      bin_type: string;
    }>;
  };
}

const Day: React.FC<IDay> = ({day, row}) => {
  const {date, bins} = row;
  const actualDay = formatDay(date);

  return (
    <View style={styles.day}>
      <View style={styles.day_dates}>
        <Text style={styles.day_dates_label}>{formatDate(date)}</Text>
        <Text style={styles.day_dates_note}>
          {day !== actualDay ? actualDay : ''}
        </Text>
      </View>
      <View style={styles.day_bins}>
        {map(bins, (col, index) => (
          <Bin col={col} key={index} />
        ))}
      </View>
    </View>
  );
};

export default Day;

const styles = StyleSheet.create({
  day: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  day_dates: {
    flex: 1,
    flexDirection: 'column',
  },
  day_dates_label: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#636369',
  },
  day_dates_note: {
    marginTop: 5,
    fontSize: 14,
    color: '#757575',
  },
  day_bins: {
    flex: 2,
    flexDirection: 'row',
  },
});
