import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import get from 'lodash/get';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import React, {
  useCallback,
  useState,
  useEffect
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import images from './utils/images';
import useDays from './hooks/useDays';
import Day from './components/schedule/Day';
import deleteConfig from './api/deleteConfig';
import { openUrl, getAreaBackgroundColor, getAreaColor } from './utils';
import { CALENDAR_URL } from './utils/constants';
import { useFocusEffect } from '@react-navigation/native';

export default (props) => {
  const { navigation, route } = props;
  const address = get(route, 'params.address', {});
  const propertyAddress = address['Property Address'];
  const asn = address['Assessment Number'];
  let [{ note, area, day, days }] = useDays(asn);
  const loading = !day;
  const handleCalendarClick = openUrl(CALENDAR_URL);
  const [config, setConfig] = useState(null);
  
  const handleBurger = useCallback(() => navigation.openDrawer(), []);

  /*
  useEffect(() => {
    console.log('reminders effect called: ')
    console.log(reminders)
  }, [reminders]);

  useEffect(() => {
    console.log('config effect called');
    console.log(config);
  }, [config]);
  */


  // on focus, set config and reminders
  useFocusEffect(
    React.useCallback(() => {
      //console.log('focus effect called');
      AsyncStorage.getItem('config').then((value) => {
        const config = JSON.parse(value);
        if (config) {
          //console.log('set config vals')
          setConfig(config);
        }else{
          //console.log('set config null')
          setConfig(null);
        }
      }).catch(console.error);
    }, [])
  );
  
  const handleAddressWarning = useCallback(() => {
    Alert.alert(
      'Clear Reminders?',
      'Changing your address will clear any reminders that you have set',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'Change Address', onPress: handleAddressChange }
      ],
      { cancelable: false }
    );
  }, [config])

  const handleAddressChange = useCallback(() => {  

    console.log("address change called");

    // delete config code for reminders
    if (config) {
      const { id } = config;
      deleteConfig(id)
        .then(() => {
          console.log("config deleted");
          AsyncStorage.removeItem('config');
        }).then(() => {
          console.log("async config deleted");
          setConfig(null);
        }).then(() => {
          AsyncStorage.removeItem('address').then(() => {
            navigation.goBack();
          }).catch(console.error);
        }).catch(console.error);
    }else{
      // if reminders aren't set
      AsyncStorage.removeItem('address').then(() => {
        navigation.goBack();
      }).catch(console.error);
    }

  }, [config]);

  const handleNotification = useCallback(() => navigation.navigate('Collection Reminder'));

  const scheduleDayLabelStyle = [
    styles.schedule_day_label,
    { backgroundColor: getAreaBackgroundColor(area) },
    !isEmpty(note) ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : {}
  ];
  const scheduleDayLabelTextStyle = [
    styles.schedule_day_label_text,
    { color: getAreaColor(area) },
  ];
  const scheduleDayNoteStyle = [
    styles.schedule_day_note,
    { backgroundColor: getAreaBackgroundColor(area) }
  ];

  return (
    <SafeAreaView dummy="test" style={styles.view}>
      <View style={styles.schedule}>
        <View style={styles.schedule_head}>
          <TouchableOpacity style={styles.schedule_button} onPress={handleBurger}>
            <Text><Icon name='bars' size={24} color='#212121' /></Text>
          </TouchableOpacity>
          <Image style={styles.schedule_logo} source={images.hbccLogo} />
        </View>
        <View style={styles.schedule_address}>
          <View style={styles.schedule_address_wrapper}>
            <View style={styles.schedule_address_card}>
              <Text><Icon name='map-marker' size={24} color='#757575' /></Text>
              <Text style={styles.schedule_address_label} numberOfLines={1}>{propertyAddress}</Text>
            </View>
            <TouchableOpacity style={styles.schedule_edit} onPress={handleAddressWarning}>
              <Text style={styles.schedule_edit_label}>change address</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.schedule_body} contentContainerStyle={[styles.schedule_body_content, loading ? { flex: 1 } : {}]}>
          {loading && <ActivityIndicator size='large' color='#f0b41c' />}
          {!loading &&
            <>
              <View style={styles.schedule_title_wrapper}>
                <Text style={styles.schedule_title} numberOfLines={1}>Your next collection days</Text>
                <View style={styles.schedule_title_bell_container}>
                  <TouchableOpacity style={styles.schedule_title_bell} onPress={handleNotification}>
                    <View style={styles.schedule_title_bell_icon}>
                      { config ?
                        <Icon name='bell-o' size={20} color='#757575' />
                        :
                        <Icon name='bell-slash-o' size={20} color='#bbbbbb' />
                      }
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={scheduleDayLabelStyle}>
                <Text style={scheduleDayLabelTextStyle}>Area {area} - {day}</Text>
              </View>
              {!isEmpty(note) &&
                <Text style={scheduleDayNoteStyle}>
                  {note}
                </Text>
              }
              <Text style={styles.schedule_note}>
                Please ensure your bins are out on the nature strip for
                collection by <Text style={styles.schedule_note_time}>5am</Text>
              </Text>
              <View style={styles.schedule_days}>
                {map(days, (row, index) => <Day day={day} row={row} key={index} />)}
              </View>
              <TouchableOpacity style={styles.schedule_calendar} onPress={handleCalendarClick}>
                <Text style={styles.schedule_calendar_text}>View Calendar on Website</Text>
                <Text><MIcon name='launch' size={18} color='#1051a4' /></Text>
              </TouchableOpacity>
            </> }
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: { flex: 1 },
  schedule: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  schedule_head: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  schedule_button: {
    width: 64,
    justifyContent: 'center',
    alignItems: 'center'
  },
  schedule_logo: {
    height: 32,
    width: 75,
    marginRight: 15
  },
  schedule_address: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  schedule_address_wrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  schedule_address_card: {
    maxWidth: 340,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingRight: 15,
    borderColor: '#616161',
    borderWidth: 2,
    borderRadius: 10
  },
  schedule_address_label: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#616161'
  },
  schedule_edit: {
    borderBottomWidth: 1,
    borderBottomColor: '#212121'
  },
  schedule_edit_label: {
    fontSize: 14,
    color: '#424242'
  },
  schedule_body: {
    flex: 1,
    paddingBottom: 10,
    paddingHorizontal: 20
  },
  schedule_body_content: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  schedule_days: {
    flex: 1,
    marginTop: 15
  },
  schedule_title_wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  schedule_title: {
    marginTop: 20,
    fontSize: 19,
    letterSpacing: .1,
    color: "#333333"
  },
  schedule_title_bell: {
    fontSize: 20,
    position: 'absolute',
    width: 50,
    height: 50,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  schedule_title_bell_icon: {
    //backgroundColor: "rgba(128,128,128,0.5)",
  },
  schedule_title_bell_container: {
    marginTop: 10,
    width: 50
  },
  schedule_day_label: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    color: '#212121',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    // borderRadius: 5,
    borderColor: '#333333',
    borderWidth: 0.5,
  },
  schedule_day_label_text: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  schedule_day_note: {
    padding: 10,
    fontSize: 15,
    opacity: 0.7,
    color: "#333333",
    backgroundColor: '#f5f5f5',
    //borderBottomLeftRadius: 5,
    //borderBottomRightRadius: 5,
    lineHeight: 20,
    letterSpacing: 0.8
  },
  schedule_day_note_text: {
    color: "#333333",
  },
  schedule_note: {
    marginTop: 5,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    lineHeight: 20,
    letterSpacing: 0.8
  },
  schedule_note_time: {
    fontWeight: 'bold'
  },
  schedule_calendar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 10
  },
  schedule_calendar_text: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1051a4'
  }
});
