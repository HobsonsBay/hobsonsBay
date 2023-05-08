import React from 'react';
import {View, Text, StyleSheet, Image, ImageSourcePropType} from 'react-native';
import {DrawerItem} from '@react-navigation/drawer';
import images from '../utils/images';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useData} from '../utils/DataContext';

/* MENU CONTENT TEMPLATE 


- Home
- Bin Schedule
- Which Bin?
- Notifications
- Quiz
- Tips and Stats

- News
- About
- Contact
- Share


*/

interface IDrawerContent {
  navigation: any;
}

const DrawerContent: React.FC<IDrawerContent> = ({navigation}) => {
  const {onShare, unread, address} = useData();
  return (
    <React.Fragment>
      <View style={styles.logo}>
        <Image
          style={styles.logoImg}
          source={images.recyclingLogoWite as ImageSourcePropType}
        />
      </View>
      <View style={styles.menuWrap}>
        <View>
          <DrawerItem
            style={styles.item}
            icon={() => <Icon name="home" size={26} color="#ffffff" />}
            label="Home"
            labelStyle={[styles.itemLabel, {marginLeft: 0}]}
            onPress={() => {
              navigation.navigate('Home');
            }}
          />
          <DrawerItem
            style={styles.item}
            label="Bin Schedule"
            labelStyle={styles.itemLabel}
            onPress={() => {
              navigation.navigate('Bin Schedule', {
                screen: address ? 'Schedule' : 'Address',
              });
            }}
          />
          <DrawerItem
            style={styles.item}
            label={() => {
              return (
                <Text numberOfLines={2} style={styles.itemLabel}>
                  Which bin does{'\n'}this go in?
                </Text>
              );
            }}
            labelStyle={styles.itemLabel}
            onPress={() => {
              navigation.navigate('Which bin');
            }}
          />
          <DrawerItem
            style={styles.item}
            label="Notifications"
            labelStyle={styles.itemLabel}
            onPress={() => {
              navigation.navigate('Collection Reminder');
            }}
          />
          <DrawerItem
            style={styles.item}
            label="Quiz"
            labelStyle={styles.itemLabel}
            onPress={() => {
              navigation.navigate('Quiz');
            }}
          />
          <DrawerItem
            style={styles.item}
            label="Tips & Stats"
            labelStyle={styles.itemLabel}
            onPress={() => {
              navigation.navigate('Tips & Stats');
            }}
          />
        </View>
        <View>
          <DrawerItem
            style={styles.item}
            label={() => {
              return (
                <View style={styles.newsfeed}>
                  {unread && (
                    <View
                      width={10}
                      height={10}
                      style={styles.unreadDot}></View>
                  )}
                  <Text style={styles.itemLabel}>News</Text>
                </View>
              );
            }}
            labelStyle={styles.itemLabel}
            onPress={() => {
              navigation.navigate('Newsfeed');
            }}
          />
          <DrawerItem
            style={styles.item}
            label="About"
            labelStyle={styles.itemLabel}
            onPress={() => {
              navigation.navigate('About');
            }}
          />
          <DrawerItem
            style={styles.item}
            label="Contact"
            labelStyle={styles.itemLabel}
            onPress={() => {
              navigation.navigate('Contact');
            }}
          />
          <DrawerItem
            style={styles.item}
            label="Share"
            labelStyle={styles.itemLabel}
            onPress={() => {
              onShare();
            }}
          />
        </View>
      </View>
    </React.Fragment>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  logo: {
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  logoImg: {
    height: 164 / 3,
    width: 600 / 3,
  },
  item: {
    marginVertical: 0,
    paddingVertical: 0,
  },
  itemLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 58,
    marginRight: 0,
  },
  newsfeed: {
    position: 'relative',
  },
  menuWrap: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingLeft: 20,
  },
  unreadDot: {
    position: 'absolute',
    left: 40,
    top: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f00',
  },
});
