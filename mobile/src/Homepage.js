import Icon from 'react-native-vector-icons/FontAwesome';
import React, {
  useCallback,
  createRef,
  useEffect,
  useState,
  useContext
} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FootButton from './components/home/FootButton';
import ActionButton from './components/home/ActionButton';
import NavTile from './components/home/NavTile';
import ScheduleTile from './components/home/ScheduleTile';
import ItemFindTile from './components/home/ItemFindTile';
import images from './utils/images';
import hasAddress from './utils/hasAddress';
import hasNotification from './utils/hasNotification';
import { openUrl } from './utils';
import get from 'lodash/get';
import { style } from "./utils/styles";
import useDays from './hooks/useDays';
import { ListItem, Br, Head, Para, LinkButton } from "./utils/Typography";
import { useFocusEffect } from '@react-navigation/native';
import { useData } from './utils/DataContext'


export default (props) => {
  const { navigation } = props;
  const handleBurger = useCallback(() => navigation.openDrawer(), []);

  const {
    address, setAddress,
    notifications, setNotifications,
    binDays
  } = useData();


  const handleNotification = useCallback(() => navigation.navigate('Collection Reminder'));
  const handleSchedule = useCallback(() => navigation.navigate('Bin Schedule'));
  const handleItems = useCallback(() => navigation.navigate('Which bin does this go in?'));

  console.log('homepage render')
  
  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.homepage}>
        <View style={styles.home_head}>
          <Image style={styles.home_logo} source={images.hbccLogo} />
          <TouchableOpacity style={styles.home_button} onPress={handleBurger}>
            <Text><Icon name='bars' size={26} color='#212121' /></Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.home_body}>
            <View style={styles.home_2up_wrap}>
              <View style={styles.home_2up}>
                <NavTile onPress={handleSchedule} label={
                 <Text>Bin Schedule<Br/>(Next bin days)</Text>  
                }>
                  <ScheduleTile binDays={binDays}/>
                </NavTile>
              </View>
              <View onPress={handleItems} style={styles.home_2up}>
                <NavTile label={
                 <Text>What bin does<Br/>this go in?</Text>  
                }>
                  <ItemFindTile/>
                </NavTile>
              </View>
            </View>
            <View style={{justifyContent:'center', flex: 1, paddingVertical: 10}}>
              <View style={styles.button}>
                <ActionButton onPress={handleSchedule} color={ address ? "#5E8310" : "#8B1614" }  left={
                  <Icon name='map-marker' size={24} color='#ffffff' />
                } right ={
                  <Icon name='gear' size={20} color='#ffffff' />
                }>
                  <Text style={styles.button_text}>{ address ? "Current Address is set to:" : "Current Address is not set." }</Text>
                  <Text numberOfLines={1} style={styles.button_sub_text}>{ address ? address : "Set an address to see bin days" }</Text>
                </ActionButton>
              </View>
              <View style={styles.button}>
                <ActionButton onPress={handleNotification} color="#1352A5" left={
                  <Icon name={ notifications ? "bell-o" : "bell-slash-o" } size={20} color='#ffffff' />
                } right ={
                  <Text style={styles.button_text}>{ notifications ? "On" : "Off" }</Text>
                }>
                  <Text style={styles.button_text}>Reminder Notifications</Text>
                </ActionButton>
              </View>
            </View>
            <View style={{justifyContent:'center', alignItems: 'center', flex: 1.3}}>
              { /* <Image style={{height: 470 * 0.13,width: 1663 * 0.13
                  // 1663 × 470
                }} source={images.recyclingLogoStretch} /> */ }
            </View>
        </ScrollView>
        <View style={styles.footer_wrap}>
          <View style={styles.footer_button}>
            <FootButton goTo='About' icon='recycle' text="About" navigation={navigation}/>
          </View>
          <View style={styles.footer_button}>
            <FootButton goTo="" icon='phone' text="Contact"/>
          </View>
          <View style={styles.footer_button}>
            <FootButton goTo='Feedback' icon='edit' text="Feedback" navigation={navigation}/>
          </View>
          <View style={styles.footer_button}>
            <FootButton icon='share-square' text="Share"/>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: { flex: 1 },
  homepage: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'space-around'
  },
  home_head: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  home_button: {
    width: 64,
    justifyContent: 'center',
    alignItems: 'center'
  },
  home_logo: {
    height: 32,
    width: 75,
    marginLeft: 15
  },
  home_body: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-around',
    flex: 1,
    minHeight: 500
    //backgroundColor: "#333333"
  },
  home_2up_wrap: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  home_2up: {
    alignItems: 'center'
  },
  button: {
    marginTop: 10
  },
  button_text:{
    fontSize: 16,
    fontWeight: 'bold',
    color: "#ffffff"
  },
  button_sub_text: {
    marginTop: 3,
    fontSize: 14,
    color: "#ffffff"
  },
  footer_wrap: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5,
    borderTopWidth: 1,
    borderColor: "#aaaaaa",
  },
  footer_button: {
    height: 60,
    //backgroundColor: 'grey'
  }
});
