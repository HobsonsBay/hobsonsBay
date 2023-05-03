import map from 'lodash/map';
import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { formatDate, formatDay } from '../../utils';
import Bin from './Bin';

export default (props) => {
  const { day, row } = props;
  const { date, bins } = row;
  const actualDay = formatDay(date);
  const sortByBinType = (arr) => {
    return arr.sort((a, b) => {
      if (a.bin_type === 'Rubbish' && b.bin_type !== 'Rubbish') {
        return -1; // "Rubbish" comes first
      } else if (a.bin_type !== 'Rubbish' && b.bin_type === 'Rubbish') {
        return 1; // "Rubbish" comes later
      } else {
        return 0; // Keep the original order
      }
    });
  };
  return (
    <View style={styles.day}>
      <View style={styles.day_dates}>
        <Text style={styles.day_dates_label}>{formatDate(date)}</Text>
        <Text style={styles.day_dates_note}>{day !== actualDay ? actualDay : ''}</Text>
      </View>
      <View style={styles.day_bins}>
        {map(sortByBinType(bins), (col, index) => (
          <Bin col={col} key={index} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  day: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 5
  },
  day_dates: {
    flex: 1,
    flexDirection: 'column'
  },
  day_dates_label: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#636369'
  },
  day_dates_note: {
    marginTop: 5,
    fontSize: 14,
    color: '#757575'
  },
  day_bins: {
    flex: 2,
    flexDirection: 'row'
  }
});
