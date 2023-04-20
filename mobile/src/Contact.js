
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking
} from 'react-native';
import images from './utils/images';
import { openUrl } from './utils';
import { RECYCLING_20_URL, POLICY_URL, CONTACT_URL, FEEDBACK_URL } from './utils/constants';
import { style } from "./utils/styles";
import { ListItem, Br, Head, Para, LinkButton, LinkTile } from "./utils/Typography";
import NavBar from "./components/navigation/NavBar";
import openMap from 'react-native-open-maps';

export default (props) => {
  const { navigation, route } = props;
  const handleContactClick = openUrl(CONTACT_URL);

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.about}>
        <NavBar navigation={navigation} route={route}/>
        <ScrollView style={styles.about_scroll} contentContainerStyle={styles.about_scroll_content}>
          <Head style={styles.about_welcome}>Contact us</Head>
          <View style={styles.about_body}>
            <Para style={styles.about_description}>
              Council is available Monday to Friday 
              <Br/>
              8am to 5pm.
            </Para>
          </View>
          <View style={styles.about_links}>
            <LinkTile icon="custService" onPress={()=>{Linking.openURL(`tel:1300 179 944`)}}>
              Speak with our customer service team<Br/>1300 179 944
            </LinkTile>
            <LinkTile icon="liveChat" onPress={()=>{Linking.openURL(`http://webchat.hobsonsbay.vic.gov.au/`)}}>
              Live chat with our customer service team
            </LinkTile>
            <LinkTile icon="relayService" onPress={()=>{Linking.openURL(`tel:133 677`)}}>
              Call National Relay Service<Br/>133 677
            </LinkTile>
            <LinkTile icon="langLine" onPress={()=>{Linking.openURL(`tel:03 9932 1212`)}}>
              Speak with us in your community language<Br/>03 9932 1212
            </LinkTile>
            <LinkTile icon="visit" onPress={()=>{openMap({ query: "115 Civic Parade, Altona VIC 3018", zoom: 17 });}}>
              Visit our customer service front counter<Br/><Br/>
              115 Civic Parade<Br/>
              Altona, Victoria, 3018<Br/>
              Australia
            </LinkTile>
            <LinkButton onPress={handleContactClick}>
              More Contact Options
            </LinkButton>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: { flex: 1 },
  about: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  about_scroll: {
    flex: 1
  },
  about_scroll_content: {
    flexDirection: 'column'
  },
  about_photo: {
    height: 200,
    marginTop: 10
  },
  about_image: {
    height: '100%',
    width: '100%'
  },
  about_body: {
    flex: 2,
    padding: 20
  },
  about_welcome: {
    marginLeft: 20
  },
  about_description: {
    marginTop: 10
  },
  about_links: {
    flexDirection: 'column',
    padding: 20
  },
});
