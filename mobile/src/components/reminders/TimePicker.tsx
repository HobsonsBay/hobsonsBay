import React, {useEffect, useState, useCallback} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const DATA = [
  {
    id: '0',
    title: '00:00 AM',
    value: '0000',
  },
  {
    id: '1',
    title: '01:00 AM',
    value: '0100',
  },
  {
    id: '2',
    title: '02:00 AM',
    value: '0200',
  },
  {
    id: '3',
    title: '03:00 AM',
    value: '0300',
  },
  {
    id: '4',
    title: '04:00 AM',
    value: '0400',
  },
  {
    id: '5',
    title: '05:00 AM',
    value: '0500',
  },
  {
    id: '6',
    title: '06:00 AM',
    value: '0600',
  },
  {
    id: '7',
    title: '07:00 AM',
    value: '0700',
  },
  {
    id: '8',
    title: '08:00 AM',
    value: '0800',
  },
  {
    id: '9',
    title: '09:00 AM',
    value: '0900',
  },
  {
    id: '10',
    title: '10:00 AM',
    value: '1000',
  },
  {
    id: '11',
    title: '11:00 AM',
    value: '1100',
  },
  {
    id: '12',
    title: '12:00 PM',
    value: '1200',
  },
  {
    id: '13',
    title: '01:00 PM',
    value: '1300',
  },
  {
    id: '14',
    title: '02:00 PM',
    value: '1400',
  },
  {
    id: '15',
    title: '03:00 PM',
    value: '1500',
  },
  {
    id: '16',
    title: '04:00 PM',
    value: '1600',
  },
  {
    id: '17',
    title: '05:00 PM',
    value: '1700',
  },
  {
    id: '18',
    title: '06:00 PM',
    value: '1800',
  },
  {
    id: '19',
    title: '07:00 PM',
    value: '1900',
  },
  {
    id: '20',
    title: '08:00 PM',
    value: '2000',
  },
  {
    id: '21',
    title: '09:00 PM',
    value: '2100',
  },
  {
    id: '22',
    title: '10:00 PM',
    value: '2200',
  },
  {
    id: '23',
    title: '11:00 PM',
    value: '2300',
  },
];

interface IItem {
  title: string;
  value: string;
  selected?: string;
  set: (time: string, selected: string) => void;
}

const Item: React.FC<IItem> = ({title, value, selected, set}) => {
  const isSelected = selected === value;

  return (
    <View
      style={[
        styles.timeBlock,
        {
          backgroundColor: isSelected ? '#2196F3' : '#fff',
        },
      ]}>
      <TouchableOpacity onPress={() => set(title, value)}>
        <Text
          style={[
            styles.title,
            {
              fontWeight: isSelected ? '400' : '200',
              color: isSelected ? '#fff' : '#000',
            },
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

interface ITimePicker {
  time: string;
  setTime: (event: React.SyntheticEvent<any> | null, date: Date) => void;
}

const TimePicker: React.FC<ITimePicker> = ({time, setTime}) => {
  console.log('jm: time ', time);

  const [selected, setSelected] = useState<string>(time);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const obj = DATA.find((o) => o.value === selected);
    setIndex(parseInt(obj?.id ?? '0'));
  }, [selected]);

  const handleSetTime = useCallback(
    (time: string, selected: string) => {
      setTime(null, new Date(`Jan 01 2001 ${time}`));
      setSelected(selected);
    },
    [setTime],
  );

  const renderItem = useCallback(
    ({item}: any) => (
      <Item
        title={item.title}
        value={item.value}
        selected={selected}
        set={handleSetTime}
      />
    ),
    [handleSetTime, selected],
  );

  return (
    <View>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selected}
        style={styles.container}
        initialScrollIndex={index}
        getItemLayout={(data, index) => ({
          length: 36,
          offset: 36 * index,
          index,
        })}
      />
    </View>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  title: {
    fontSize: 32,
    padding: 2,
  },
  timeBlock: {
    borderRadius: 5,
    paddingHorizontal: 5,
  },
});
