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
import { style } from "./utils/styles";
import { ListItem, Br, Head, Para, LinkButton } from "./utils/Typography";
import NavBar from "./components/navigation/NavBar";
import SurveyMonkey from 'react-native-survey-monkey';


export default (props) => {
  const { navigation, route } = props;
  const handleContactClick = openUrl(CONTACT_URL);
  const handleRecycling20Click = openUrl(RECYCLING_20_URL);
  const handleFeedbackClick = openUrl(FEEDBACK_URL);
  const handlePolicyClick = openUrl(POLICY_URL);
  const handleBurger = useCallback(() => navigation.openDrawer(), []);


  const surveyMonkeyRef = React.createRef();
  const handleSurveyClick = () => surveyMonkeyRef.current.showSurveyMonkey('3QBD9ST');

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.about}>
        <NavBar navigation={navigation} route={route}/>
        <ScrollView style={styles.about_scroll} contentContainerStyle={styles.about_scroll_content}>
          <Head style={styles.about_welcome}>About Recycling 2.0</Head>
          <View style={styles.about_photo}>
            <Image style={styles.about_image} source={images.aerielAltona} />
          </View>
          <View style={styles.about_body}>
            <Para style={styles.about_description}>
                            Hobsons Bay City Council’s kerbside waste and recycling service
                            redirects household waste from landfill into local recycling streams.
              <Br/><Br/>
                            This app is an early release and more features will be added in the
                            coming months to support your usage of the Recycling 2.0 service.
              <Br/><Br/>
                            We are continually improving the app and welcome your feedback.
            </Para>
          </View>
          <View style={styles.about_links}>
            <LinkButton onPress={handleContactClick}>
              Contact Hobsons Bay City Council
            </LinkButton>
            <LinkButton onPress={handleRecycling20Click}>
              Visit the Recycling 2.0 Website
            </LinkButton>
            <LinkButton onPress={handleSurveyClick}>
              Provide App Feedback
            </LinkButton>
            <LinkButton onPress={handlePolicyClick}>
              Read Privacy Policy
            </LinkButton>
          </View>
        </ScrollView>
      </View>
      <SurveyMonkey ref={ surveyMonkeyRef } />
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
