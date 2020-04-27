import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import React, {
  useCallback
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import images from './utils/images';
import { openUrl } from './utils';
import { RECYCLING_20_URL, POLICY_URL, CONTACT_URL, FEEDBACK_URL } from './utils/constants';

export default (props) => {
  const { navigation } = props;
  const handleContactClick = openUrl(CONTACT_URL);
  const handleRecycling20Click = openUrl(RECYCLING_20_URL);
  const handleFeedbackClick = openUrl(FEEDBACK_URL);
  const handlePolicyClick = openUrl(POLICY_URL);
  const handleBurger = useCallback(() => navigation.openDrawer(), []);

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.about}>
        <View style={styles.about_head}>
          <TouchableOpacity style={styles.about_button} onPress={handleBurger}>
            <Text><Icon name='bars' size={26} color='#212121' /></Text>
          </TouchableOpacity>
          <Image style={styles.about_logo} source={images.hbccLogo} />
        </View>

        <ScrollView style={styles.about_scroll} contentContainerStyle={styles.about_scroll_content}>
          <Text style={styles.about_welcome}>About Recycling 2.0</Text>
          <View style={styles.about_photo}>
            <Image style={styles.about_image} source={images.aerielAltona} />
          </View>
          <View style={styles.about_body}>
            <Text style={styles.about_description}>
                            Hobsons Bay City Council’s kerbside waste and recycling service
                            redirects household waste from landfill into local recycling streams.
              {'\n\n'}
                            This app is an early release and more features will be added in the
                            coming months to support your usage of the Recycling 2.0 service.
              {'\n\n'}
                            We are continually improving the app and welcome your feedback.
            </Text>
          </View>
          <View style={styles.about_links}>
            <TouchableOpacity style={styles.about_link_button} onPress={handleContactClick}>
              <Text style={styles.about_link_label}>Contact Hobsons Bay City Council</Text>
              <Text><MIcon name='launch' size={18} color='#1352A5' /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.about_link_button} onPress={handleRecycling20Click}>
              <Text style={styles.about_link_label}>Visit the Recycling 2.0 Website</Text>
              <Text><MIcon name='launch' size={18} color='#1352A5' /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.about_link_button} onPress={handleFeedbackClick}>
              <Text style={styles.about_link_label}>Provide App Feedback</Text>
              <Text><MIcon name='launch' size={18} color='#1352A5' /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.about_link_button} onPress={handlePolicyClick}>
              <Text style={styles.about_link_label}>Read Privacy Policy</Text>
              <Text><MIcon name='launch' size={18} color='#1352A5' /></Text>
            </TouchableOpacity>
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
  about_head: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  about_button: {
    width: 64,
    justifyContent: 'center',
    alignItems: 'center'
  },
  about_logo: {
    height: 32,
    width: 75,
    marginRight: 15
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
    marginLeft: 20,
    fontSize: 20,
    fontWeight: 'bold'
  },
  about_description: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 25
  },
  about_links: {
    flexDirection: 'column',
    padding: 20
  },
  about_link_button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#9e9e9e'
  },
  about_link_label: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1352A5'
  }
});
