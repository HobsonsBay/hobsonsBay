import Icon from 'react-native-vector-icons/FontAwesome';
import React, {
  useCallback,
  createRef
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
import images from './utils/images';
import { openUrl } from './utils';
import { FEEDBACK_URL } from './utils/constants';
import SurveyMonkey from 'react-native-survey-monkey';
import { style } from "./utils/styles";
import { ListItem, Br, Head, Para, LinkButton } from "./utils/Typography";

export default (props) => {
  const { navigation } = props;
  const handleFeedbackClick = openUrl(FEEDBACK_URL);
  const handleBurger = useCallback(() => navigation.openDrawer(), []);
  
  const surveyMonkeyRef = createRef();
  const handleSurveyClick = () => surveyMonkeyRef.current.showSurveyMonkey('FMNNPFY');
  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.feedback}>
        <View style={styles.feedback_head}>
          <TouchableOpacity style={styles.feedback_button} onPress={handleBurger}>
            <Text><Icon name='bars' size={26} color='#212121' /></Text>
          </TouchableOpacity>
          <Image style={styles.feedback_logo} source={images.hbccLogo} />
        </View>
        <ScrollView>
          <View style={styles.feedback_body}>
            <Head style={styles.feedback_welcome}>Feedback</Head>
            <Para style={styles.feedback_description}>
                          Thank you for using the Recycling 2.0 app.
                          <Br/><Br/>
                          This app is developed with community feedback to support
                          your usage of the Recycling 2.0 service. We are continually
                          improving and welcome your feedback.
                          <Br/><Br/>
                          Complete the feedback form below if you would like to report
                          a problem, have a suggestion or a question feedback the app.
            </Para>
          </View>
          <View style={styles.feedback_links}>
            <TouchableOpacity style={styles.feedback_link_button} onPress={handleSurveyClick}>
              <Text style={styles.feedback_link_label}>Provide your feedback</Text>
            </TouchableOpacity>
          </View>
          <SurveyMonkey ref={ surveyMonkeyRef } />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: { flex: 1 },
  feedback: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  feedback_head: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  feedback_button: {
    width: 64,
    justifyContent: 'center',
    alignItems: 'center'
  },
  feedback_logo: {
    height: 32,
    width: 75,
    marginRight: 15
  },
  feedback_body: {
    padding: 20
  },
  feedback_welcome: {
    ...style.type.headings.medium
  },
  feedback_description: {
    marginTop: 20,
    ...style.type.paras.default
  },
  feedback_links: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20
  },
  feedback_link_button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#1352A5'
  },
  feedback_link_label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  }
});
