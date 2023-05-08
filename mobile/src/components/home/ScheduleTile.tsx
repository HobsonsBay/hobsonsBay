import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ImageSourcePropType,
} from 'react-native';
import images from '../../utils/images';
import {formatDate, formatDayTomorrow} from '../../utils';

interface BinType {
  bin_type: string;
}

interface IScheduleTile {
  binDays: {
    area: string;
    day: string;
    days: BinDay[];
    note: string;
  };
}

export interface BinDay {
  bins: Bin[];
  date: string;
}

export interface Bin {
  bin_type: string;
  date: string;
  note: string;
  zone: string;
}

const ScheduleTile: React.FC<IScheduleTile> = ({binDays}) => {
  const [binDate, setBinDate] = useState<string>('01/01/2020');
  const [binType, setBinType] = useState<BinType[]>([]);

  useEffect(() => {
    if (binDays.days) {
      setBinDate(binDays.days[0].date);
      setBinType(binDays.days[0].bins);
    } else {
      setBinDate('01/01/2020');
      setBinType([]);
    }
  }, [binDays]);

  const binCol = (bin: string) => {
    let type = bin;
    switch (type) {
      case 'Food and Garden':
        return '#9ACA3C';
      case 'Rubbish':
        return '#999';
      case 'Commingled Recycling':
      case 'Mixed Recycling':
        return '#FFDC00';
      case 'Glass':
        return '#A032A0';
      default:
        return '#ffffff';
    }
  };

  return (
    <View style={styles.tile}>
      <View style={styles.redheader}>
        <Text style={styles.monthtext}>
          {binDays.day && formatDayTomorrow(binDate)}
        </Text>
      </View>
      <Text style={styles.date}>{binDays.day && formatDate(binDate)}</Text>
      <View style={styles.bintypes}>
        {binType.length > 0 &&
          binType.map((bin, key) => (
            <View
              key={key}
              style={[styles.bintype, {backgroundColor: binCol(bin.bin_type)}]}>
              {bin.bin_type === 'Rubbish' && (
                <ImageBackground
                  source={images.rubbish_home as ImageSourcePropType}
                  style={styles.bg}>
                  <Text> </Text>
                </ImageBackground>
              )}
            </View>
          ))}
      </View>
    </View>
  );
};

export default ScheduleTile;

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
  },
  redheader: {
    padding: 10,
    backgroundColor: '#921F1F',
    width: '100%',
    textAlign: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  monthtext: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  date: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bintypes: {
    //backgroundColor: "#fff",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 12,
  },
  bintype: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#999',
  },
  bg: {
    width: 22,
    height: 22,
  },
});
