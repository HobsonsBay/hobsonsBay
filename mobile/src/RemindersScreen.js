import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-community/picker';
import CheckBox from '@react-native-community/checkbox';
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
import { useData } from './utils/DataContext'
import NavBar from "./components/navigation/NavBar";
import NotificationsOn from "./utils/handleNotification";


export default (props) => {
  const { navigation } = props;
  const [disabled, setDisabled] = useState(true);
  const [status, setStatus] = useState(false);
  const [date, setDate] = useState(startOfHour(new Date(2001, 1, 1, 18, 0, 0)));
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(true);
  const handlePolicyClick = openUrl(POLICY_URL);
  const {
    config, setConfig, 
    addressObj, setAddressObj, 
    address, setAddress,
    notifications, setNotifications,
    notificationsOn, notificationsOff, notificationsChange,
    //fullAddress
  } = useData();
  const [toggleCheckBox, setToggleCheckBox] = useState(false)


  console.log('reminders render')

  //console.log(config);


  const handleBurger = useCallback(() => navigation.openDrawer(), []);

  const goToBinSchedule = useCallback(() => {
    //navigation.reset({ index: 0, routes: [{ name: 'Bin Schedule' }] });
    navigation.navigate('Bin Schedule', { screen: 'Address' });
  }, []);

  // Alert user that an address is required to turn on reminders
  const promptAddress = () => {
    Alert.alert(
      'Address Required',
      'Add an Address in Bin Schedule to receive notifications',
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
    if (disabled && !address) promptAddress();
  };

  const handleChangeToggle = (value) => {
    setDisabled(true);

    // check if notifications are not active, and set them on
    if(!notifications){

      // tempororary holder for reminder vals
      const type = { type_reminder:true, type_service:true };

      notificationsOn(type, format(date, 'HHmm'))
      .then((response)=>{
        console.log('trigger on',response);
        setStatus(true);
        setDisabled(false);
      }).catch((e)=>{
        alert('A network error occurred. Please try again later');
        console.log('noton err:',e);
        setStatus(false);
        setDisabled(false);
      })

    }else{
      notificationsOff()
      .then((response)=>{
        console.log('trigger off', response);
        setStatus(false);
        setDisabled(false);
      }).catch((e)=>{
        alert('A network error occurred. Please try again later');
        console.log('notoff err:',e);
        setStatus(true);
        setDisabled(false);
      })
    }
  }

  const handleChangeTime = (event, selectedDate) => {
    const currentDate = startOfHour(selectedDate || date);
    setShow(Platform.OS === 'ios');

    if (config) {

      const time = format(currentDate, 'HHmm', { timeZone: 'Australia/Melbourne' });

      const type = { type_reminder:true, type_service:true};

      notificationsChange(type, time)
        .then((config) => { 
          setConfig(config);
          setDate(currentDate);
        }).catch((e)=>{
          alert('A network error occurred. Please try again later');
          console.log('notchange err:',e);
          setStatus(true);
          setDisabled(false);
        });
    }
  };

  const handleChangeType = (service) => {
    const type = { 
      type_reminder: config.type_reminder,
      type_service: config.type_service,
      ...service 
    }
    notificationsChange(type, config.time)
      .then((config) => { 
        setConfig({...config, ...service})
      }).catch((e)=>{
        alert('A network error occurred. Please try again later');
        console.log('notchange err:',e);
        setStatus(true);
        setDisabled(false);
      });

  }

  const showPicker = () => {
    if (disabled) {
      promptAddress();
    } else {
      setShow(status);
      setModal(true);
    }
  };

  useEffect(() => {
    setDisabled(!address);
  }, [address]);

  useEffect(() => {
    if (config) {
      const currentDate = getReminderDate(config.time);
      setStatus(true);
      setDate(currentDate);
    }
  }, [config]);

  // cheeky effect to set global notifications
  // TODO improve this whole process 
  // useEffect(() => {
  //   setNotifications(status)
  // }, [status]);

  const remindersPickerTimeStyle = [
    styles.reminders_picker_time,
    { color: (disabled || !status) ? '#e0e0e0' : '#616161' }
  ];


  return (
    <SafeAreaView style={styles.view}>
      <ScrollView  style={styles.reminders}>
        <NavBar navigation={navigation}/>
        <View style={styles.reminders_body}>
          <Text style={styles.reminders_title}>Collection Reminder</Text>
          <View style={styles.reminders_toggle}>
            <Text style={styles.reminders_toggle_label}>Remind Me</Text>
            <View style={styles.reminders_toggle_spinner} >
              { address && <ActivityIndicator animating={disabled} size='large' color='#333333' /> }
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
        
        {config &&
          <View>

            <CheckBox
              boxType="square"
              tintColors={{true:"#2196F3"}}
              disabled={true}
              lineWidth={3}
              animationDuration={0.2}
              onAnimationType="one-stroke"
              value={toggleCheckBox}
              onValueChange={(newValue) => setToggleCheckBox(newValue)}
            />
            <TouchableOpacity style={{padding:10}} onPress={() => handleChangeType({type_reminder:!config.type_reminder})}>
              <Text style={styles.reminders_policy_text}>Test Reminder {
                config.type_reminder ? "on" : "off"
              }</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{padding:10}} onPress={() => handleChangeType({type_service:!config.type_service})}>
              <Text style={styles.reminders_policy_text}>Test Service {
                config.type_service ? "on" : "off"
              }</Text>
            </TouchableOpacity>
          </View>
        }
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
