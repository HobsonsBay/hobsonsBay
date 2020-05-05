import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, {
  useEffect,
  useState,
  useCallback
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import images from './utils/images';
import { openUrl, formatTime } from './utils';
import { POLICY_URL } from './utils/constants';
import Toggle from './components/reminders/Toggle';

export default (props) => {
  const { navigation } = props;
  const [disabled, setDisabled] = useState(true);
  const [status, setStatus] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const handlePolicyClick = openUrl(POLICY_URL);
  const handleBurger = useCallback(() => navigation.openDrawer(), []);

  const onPress = () => {
    console.log('Pressed');
  };

  const handleChangeToggle = (value) => {
    console.log('Changed');
    setStatus(value);
  };

  const handleChangeTime = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = () => {
    setShow(true);
  };

  useEffect(() => {
    AsyncStorage.getItem('address').then((value) => {
      const address = JSON.parse(value);
      address && setDisabled(false);
    }).catch(console.error);
  }, []);

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.reminders}>
        <View style={styles.reminders_head}>
          <TouchableOpacity style={styles.reminders_button} onPress={handleBurger}>
            <Text><Icon name='bars' size={26} color='#212121' /></Text>
          </TouchableOpacity>
          <Image style={styles.reminders_logo} source={images.hbccLogo} />
        </View>
        <View style={styles.reminders_body}>
          <Text style={styles.reminders_title}>Collection Reminders</Text>
          <View style={styles.reminders_toggle}>
            <Text style={styles.reminders_toggle_label}>Remind Me</Text>
            <Toggle style={styles.reminders_toggle_cb} value={status} disabled={disabled} onPress={onPress} onChange={handleChangeToggle} />
          </View>
          <Text style={styles.reminders_description}>
            Receive a push notification <Text style={styles.reminders_description_duration}>the day before</Text> your collection day.
          </Text>
          <View style={styles.reminders_picker}>
            <Text style={styles.reminders_picker_label}>Set Reminder Time</Text>
            <TouchableOpacity style={styles.reminders_picker_selector} onPress={showMode}>
              <Text style={styles.reminders_picker_time}>{formatTime(date)}</Text>
              <Text><Icon name='chevron-down' size={16} color='#616161' /></Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.reminders_policy} onPress={handlePolicyClick}>
          <Text style={styles.reminders_policy_text}>Privacy Policy</Text>
          <Text><MIcon name='launch' size={22} color='#1051a4' /></Text>
        </TouchableOpacity>
        {show &&
          <DateTimePicker
            timeZoneOffsetInMinutes={0}
            minuteInterval={30}
            value={date}
            mode='time'
            is24Hour={false}
            display='spinner'
            onChange={handleChangeTime}
          />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: { flex: 1 },
  reminders: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  reminders_head: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  reminders_button: {
    width: 64,
    justifyContent: 'center',
    alignItems: 'center'
  },
  reminders_logo: {
    height: 32,
    width: 75,
    marginRight: 15
  },
  reminders_body: {
    padding: 20
  },
  reminders_title: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  reminders_toggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  reminders_toggle_label: {
    fontSize: 22,
    fontWeight: '400',
    color: '#000'
  },
  reminders_toggle_cb: {
    marginRight: 0
  },
  reminders_description: {
    marginTop: 20,
    fontSize: 18,
    color: '#424242',
    lineHeight: 25
  },
  reminders_description_duration: {
    fontWeight: 'bold'
  },
  reminders_picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  reminders_picker_label: {
    fontSize: 20,
    fontWeight: '400',
    color: '#212121'
  },
  reminders_picker_selector: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  reminders_picker_time: {
    marginRight: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#616161'
  },
  reminders_policy: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  reminders_policy_text: {
    marginRight: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1051a4'
  }
});
