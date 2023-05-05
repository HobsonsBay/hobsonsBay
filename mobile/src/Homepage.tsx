import Icon from 'react-native-vector-icons/FontAwesome';
import React, {useCallback, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  ImageSourcePropType,
} from 'react-native';
import FootButton from './components/home/FootButton';
import ActionButton from './components/home/ActionButton';
import NavTile from './components/home/NavTile';
import ScheduleTile from './components/home/ScheduleTile';
import ItemFindTile from './components/home/ItemFindTile';
import images from './utils/images';
import {clearAddress} from './utils/handleAddress';
import {Br} from './utils/Typography';
import {useData} from './utils/DataContext';
import NavBar from './components/navigation/NavBar';

interface IHomepage {
  navigation: any;
  route: any;
}

const Homepage: React.FC<IHomepage> = ({navigation, route}) => {
  const {
    address,
    setAddress,
    notifications,
    // setNotifications,
    binDays,
    config,
    // setConfig,
    onShare,
    onboard,
    notificationsOff,
    unread,
    navToNews,
    setNavToNews,
  } = useData();

  useEffect(() => {
    if (!onboard) navigation.navigate('Bin Schedule', {screen: 'Address'});
  }, [onboard, navigation]);

  useEffect(() => {
    if (navToNews) {
      setNavToNews(false);
      navigation.navigate('Newsfeed');
    }
  }, [navToNews, setNavToNews, navigation]);

  const handleAddressChange = useCallback(() => {
    if (config) {
      notificationsOff()
        .then(() => {
          return clearAddress();
        })
        .then(() => {
          setAddress('change');
        })
        .catch(console.error);
    } else {
      clearAddress()
        .then(() => {
          setAddress('change');
        })
        .catch(console.error);
    }
  }, [config, notificationsOff, setAddress]);

  const handleAddressWarning = useCallback(() => {
    Alert.alert(
      'Change Address?',
      'Changing your address will clear any reminders that you have set',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'Change Address', onPress: handleAddressChange},
      ],
      {cancelable: false},
    );
  }, [handleAddressChange]);

  useEffect(() => {
    if (address === 'change') {
      setAddress(false);
      navigation.navigate('Bin Schedule', {screen: 'Address'});
    }
  }, [navigation, address, setAddress]);

  const handleNotification = useCallback(
    () => navigation.navigate('Collection Reminder'),
    [navigation],
  );

  const handleSchedule = useCallback(
    () =>
      navigation.navigate('Bin Schedule', {
        screen: address ? 'Schedule' : 'Address',
      }),
    [address, navigation],
  );

  const handleItems = useCallback(
    () => navigation.navigate('Which bin'),
    [navigation],
  );

  const handleQuiz = useCallback(
    () => navigation.navigate('Quiz'),
    [navigation],
  );

  const handleTips = useCallback(
    () => navigation.navigate('Tips & Stats'),
    [navigation],
  );

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.homepage}>
        <NavBar navigation={navigation} route={route} isHome={true} />
        <ScrollView contentContainerStyle={styles.home_body}>
          <View style={styles.home_2up_wrap}>
            <View style={[styles.home_2up, {opacity: binDays.day ? 1 : 0.3}]}>
              <NavTile
                onPress={handleSchedule}
                label={<Text>Bin Schedule</Text>}>
                <ScheduleTile binDays={binDays} />
              </NavTile>
            </View>
            <View style={styles.home_2up}>
              <NavTile
                onPress={handleItems}
                label={
                  <Text>
                    Which bin does
                    <Br />
                    this go in?
                  </Text>
                }>
                <ItemFindTile />
              </NavTile>
            </View>
          </View>
          <View style={styles.home_2up_wrap}>
            <View style={styles.home_2up}>
              <NavTile onPress={handleQuiz} label={<Text>Quiz</Text>}>
                <Image
                  source={images.quiz as ImageSourcePropType}
                  style={[styles.img_center, {width: 87, height: 84}]}
                />
              </NavTile>
            </View>
            <View style={styles.home_2up}>
              <NavTile onPress={handleTips} label={<Text>Tips and Stats</Text>}>
                <Image
                  source={images.tips_stats as ImageSourcePropType}
                  style={[styles.img_center, {width: 83, height: 81}]}
                />
              </NavTile>
            </View>
          </View>
          <View style={styles.home_control_buttons}>
            <View style={styles.button}>
              <ActionButton
                onPress={handleAddressWarning}
                color={address && address != 'change' ? '#5E8310' : '#8B1614'}
                left={<Icon name="map-marker" size={24} color="#ffffff" />}
                right={<Icon name="gear" size={20} color="#ffffff" />}>
                <Text style={styles.button_text}>
                  {address && address != 'change'
                    ? 'Current Address is set to:'
                    : 'Current Address is not set.'}
                </Text>
                <Text numberOfLines={1} style={styles.button_sub_text}>
                  {address && address != 'change'
                    ? address
                    : 'Set an address to see bin days'}
                </Text>
              </ActionButton>
            </View>
            <View style={styles.button}>
              <ActionButton
                onPress={handleNotification}
                color="#1352A5"
                left={
                  <Icon
                    name={notifications ? 'bell-o' : 'bell-slash-o'}
                    size={20}
                    color="#ffffff"
                  />
                }
                right={
                  <Text style={styles.button_text}>
                    {notifications ? 'On' : 'Off'}
                  </Text>
                }>
                <Text style={styles.button_text}>Notifications</Text>
              </ActionButton>
            </View>
            <Br />
            <Br />
          </View>
        </ScrollView>
        <View style={styles.footer_wrap}>
          <View style={styles.footer_button}>
            <FootButton
              goTo="About"
              icon="recycle"
              text="About"
              navigation={navigation}
            />
          </View>
          <View style={styles.footer_button}>
            <FootButton
              goTo="Contact"
              icon="phone"
              text="Contact"
              navigation={navigation}
            />
          </View>
          <View style={styles.footer_button}>
            <FootButton
              goTo="Newsfeed"
              unread={unread}
              icon="newspaper"
              text="News"
              navigation={navigation}
            />
          </View>
          <View style={styles.footer_button}>
            <FootButton onPress={onShare} icon="share-square" text="Share" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Homepage;

const styles = StyleSheet.create({
  view: {flex: 1},
  homepage: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
  },
  home_body: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-around',
    flex: 1,
    minHeight: 500,
    //backgroundColor: "#333333"
  },
  home_2up_wrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
  },
  home_2up: {
    alignItems: 'center',
  },
  home_control_buttons: {
    flex: 1,
    paddingBottom: 40,
  },
  button: {
    marginBottom: 10,
  },
  button_text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  button_sub_text: {
    marginTop: 3,
    fontSize: 14,
    color: '#ffffff',
  },
  img_center: {
    alignSelf: 'center',
    marginTop: 25,
  },
  footer_wrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
    borderTopWidth: 1,
    borderColor: '#aaaaaa',
  },
  footer_button: {
    height: 60,
    //backgroundColor: 'grey'
  },
});
