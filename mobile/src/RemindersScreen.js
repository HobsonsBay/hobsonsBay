import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-community/picker';
import messaging from '@react-native-firebase/messaging';
import format from 'date-fns/format';
import startOfHour from 'date-fns/startOfHour';
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
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  Modal,
  Alert
} from 'react-native';
import images from './utils/images';
import { openUrl, formatTime, getReminderDate } from './utils';
import { POLICY_URL } from './utils/constants';
import Toggle from './components/reminders/Toggle';
import postConfig from './api/postConfig';
import deleteConfig from './api/deleteConfig';
import putConfig from './api/putConfig';
import useFullAddress from './hooks/useFullAddress';

export default (props) => {
  const { navigation } = props;
  const [fullAddress] = useFullAddress();
  const [disabled, setDisabled] = useState(true);
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState(false);
  const [date, setDate] = useState(startOfHour(new Date(2001, 1, 1, 18, 0, 0)));
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(true);
  const handlePolicyClick = openUrl(POLICY_URL);


  //console.log(config);


  const handleBurger = useCallback(() => navigation.openDrawer(), []);
  const goToBinSchedule = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Bin Schedule' }] });
  }, []);

  // Alert user that an address is required to turn on reminders
  const promptAddress = () => {
    Alert.alert(
      'Address Required',
      'Add an Address in Bin Schedule to receive reminders',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'Go to Bin Schedule', onPress: goToBinSchedule }
      ],
      { cancelable: false }
    );
  };

  const handleButtonClose = () => {
    setModal(false);
  };

  const handlePressToggle = () => {
    if (disabled && !fullAddress) promptAddress();
  };

  const handleChangeToggle = (value) => {
    if (value) {
      if (fullAddress) {
        setDisabled(true);
        const { day, area } = fullAddress;
        const time = format(date, 'HHmm');
        const zone = `${day} Area ${area}`;
        messaging().requestPermission()
          .then(() => messaging().getToken())
          .then(token => {
            const body = { token, zone, time };
            return postConfig(body);
          }).then((config) => {
            return Promise.all([config, AsyncStorage.setItem('config', JSON.stringify(config))]);
          }).then(([config]) => {
            setStatus(value);
            setConfig(config);
            setDisabled(false);
          }).catch(console.error);
      }
    } else {
      if (config) {
        setDisabled(true);
        const { id } = config;
        deleteConfig(id)
          .then(() => {
            return AsyncStorage.removeItem('config');
          }).then(() => {
            setStatus(value);
            setConfig(null);
            setDisabled(false);
          }).catch(console.error);
      }
    }
    //setDisabled(false);
  };

  const handleChangeTime = (event, selectedDate) => {
    const currentDate = startOfHour(selectedDate || date);
    setShow(Platform.OS === 'ios');

    if (config) {
      const { id } = config;
      const time = format(currentDate, 'HHmm', { timeZone: 'Australia/Melbourne' });
      const body = { ...config, time };
      putConfig(id, body)
        .then((config) => {
          return Promise.all([config, AsyncStorage.setItem('config', JSON.stringify(config))]);
        }).then(([config]) => {
          setDate(currentDate);
          setConfig(config);
        }).catch(console.error);
    }
  };

  const showPicker = () => {
    if (disabled) {
      promptAddress();
    } else {
      setShow(status);
      setModal(true);
    }
  };

  useEffect(() => {
    if (fullAddress) {
      AsyncStorage.getItem('config').then((value) => {
        const config = JSON.parse(value);
        console.log("config from async")
        console.log(config)
        if (config) {
          const { time } = config;
          const currentDate = getReminderDate(time);
          setStatus(true);
          setDate(currentDate);
        }
        setConfig(config);
      }).catch(console.error);
    }
    setDisabled(!fullAddress);
  }, [fullAddress]);

  const remindersPickerTimeStyle = [
    styles.reminders_picker_time,
    { color: (disabled || !status) ? '#e0e0e0' : '#616161' }
  ];

  console.log(date)

  return (
    <SafeAreaView style={styles.view}>
      <ScrollView  style={styles.reminders}>
        <View style={styles.reminders_head}>
          <TouchableOpacity style={styles.reminders_button} onPress={handleBurger}>
            <Text><Icon name='bars' size={26} color='#212121' /></Text>
          </TouchableOpacity>
          <Image style={styles.reminders_logo} source={images.hbccLogo} />
        </View>
        <View style={styles.reminders_body}>
          <Text style={styles.reminders_title}>Collection Reminder</Text>
          <View style={styles.reminders_toggle}>
            <Text style={styles.reminders_toggle_label}>Remind Me</Text>
            <View style={styles.reminders_toggle_spinner} >
              { fullAddress && <ActivityIndicator animating={disabled} size='large' color='#333333' /> }
              <Toggle style={styles.reminders_toggle_cb} value={status} disabled={disabled} onPress={handlePressToggle} onChange={handleChangeToggle} />
            </View>
          </View>
          <Text style={styles.reminders_description}>
            Receive a push notification <Text style={styles.reminders_description_duration}>the day before</Text> your collection day.
          </Text>
          <View style={styles.reminders_picker}>
            <Text style={styles.reminders_picker_label}>Set Reminder Time</Text>
            <TouchableOpacity style={styles.reminders_picker_selector} onPress={showPicker} activeOpacity={0.8}>
              <Text style={remindersPickerTimeStyle}>{formatTime(date)}</Text>
              <Text><Icon name='chevron-down' size={16} color={(disabled || !status) ? '#e0e0e0' : '#616161'} /></Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.reminders_description_helptext}>
            Reminders will be sent on the hour. Any time set will default to the nearest hour.
          </Text>
        </View>
        <TouchableOpacity style={styles.reminders_policy} onPress={handlePolicyClick}>
          <Text style={styles.reminders_policy_text}>Privacy Policy</Text>
          <Text><MIcon name='launch' size={22} color='#1051a4' /></Text>
        </TouchableOpacity>

        {/*<Picker
          selectedValue={hour}
          style={{height: 50, width: "100%"}}
          mode="dropdown"
          onValueChange={(itemValue, itemIndex) =>
            setHour(itemValue)
          }>
          <Picker.Item label="12:00am" value="0000" />
          <Picker.Item label="1:00am" value="0100" />
          <Picker.Item label="2:00am" value="0200" />
          <Picker.Item label="3:00am" value="0300" />
          <Picker.Item label="4:00am" value="0400" />
          <Picker.Item label="5:00am" value="0500" />
          <Picker.Item label="6:00am" value="0600" />
          <Picker.Item label="7:00am" value="0700" />
          <Picker.Item label="8:00am" value="0800" />
          <Picker.Item label="9:00am" value="0900" />
          <Picker.Item label="10:00am" value="1000" />
          <Picker.Item label="11:00am" value="1100" />
          <Picker.Item label="12:00pm" value="1200" />
          <Picker.Item label="1:00pm" value="1300" />
          <Picker.Item label="2:00pm" value="1400" />
          <Picker.Item label="3:00pm" value="1500" />
          <Picker.Item label="4:00pm" value="1600" />
          <Picker.Item label="5:00pm" value="1700" />
          <Picker.Item label="6:00pm" value="1800" />
          <Picker.Item label="7:00pm" value="1900" />
          <Picker.Item label="8:00pm" value="2000" />
          <Picker.Item label="9:00pm" value="2100" />
          <Picker.Item label="10:00pm" value="2200" />
          <Picker.Item label="11:00pm" value="2300" />
        </Picker>*/}

        {Platform.OS === 'android' && show && status &&
          <DateTimePicker
            minuteInterval={30}
            value={date}
            mode='time'
            is24Hour={false}
            display='spinner'
            onChange={handleChangeTime}
          />}
        {Platform.OS === 'ios' && show && status &&
          <Modal animationType='fade' transparent visible={modal}>
            <View style={styles.reminders_modal}>
              <View style={styles.reminders_modal_body}>
                <DateTimePicker
                  style={{width:'100%'}}
                  textColor="black" 
                  minuteInterval={30}
                  value={date}
                  mode='time'
                  is24Hour={false}
                  display='spinner'
                  onChange={handleChangeTime}
                />
              </View>
              <TouchableOpacity style={styles.reminders_modal_button} onPress={handleButtonClose}>
                <Text style={styles.reminders_modal_button_label}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>}
      </ScrollView>
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
  reminders_toggle_spinner: {
    flexDirection: 'row',
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
  reminders_description_helptext: {
    marginTop: 30,
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
    fontWeight: 'bold'
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
  },
  reminders_modal: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  reminders_modal_body: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10
  },
  reminders_modal_button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  reminders_modal_button_label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3'
  }
});
