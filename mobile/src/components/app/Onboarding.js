import AsyncStorage from '@react-native-community/async-storage';
import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView
} from 'react-native';
import images from '../../utils/images';

export default () => {
  const [modalVisible, setModalVisible] = useState(false);
  const handleButton = useCallback(() => {
    // set onboarded to version
    AsyncStorage.setItem('onboarded', JSON.stringify({version:"107e"})).then(() => {
      setModalVisible(false);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('onboarded').then((value) => {
      const onboarded = JSON.parse(value);
      // check for version rather than boolean
      if(!onboarded || onboarded.version != "107e") setModalVisible(true);
    }).catch(console.error);
  }, []);

  return (
    <Modal animationType='fade' transparent={false} visible={modalVisible}>
      <View style={styles.onboarding}>
        <ScrollView style={styles.onboarding_scroll} contentContainerStyle={styles.onboarding_scroll_content}>
          <View style={styles.onboarding_head}>
            <Image style={styles.onboarding_image} source={images.recyclingLogoStretch} />
          </View>
          <View style={styles.onboarding_body}>
            <Text style={styles.onboarding_welcome}>Welcome to the Recycling 2.0 app</Text>
            <Text style={styles.onboarding_description}>
            This app supports your usage of the Recycling 2.0 service, redirecting household waste from landfill into local recycling streams.
            </Text>
            <View style={styles.onboarding_list}>
              <Text style={styles.onboarding_list_item}>{'\u2022'}</Text>
              <Text style={styles.onboarding_description}><Text style={{fontWeight: "bold"}}>Bin Schedule:</Text> Enter your address to find your 
     next bin day</Text>
            </View>
            <View style={styles.onboarding_list}>
              <Text style={styles.onboarding_list_item}>{'\u2022'}</Text>
              <Text style={styles.onboarding_description}><Text style={{fontWeight: "bold"}}>Which bin does this go in?: </Text> Search and find    
      out how to dispose of household items{'\n'}</Text>
            </View>
            <Text style={styles.onboarding_welcome}>What’s New</Text>
            <Text style={styles.onboarding_description}>Collection Reminder</Text>
            <View style={styles.onboarding_list}>
              <Text style={styles.onboarding_list_item}>{'\u2022'}</Text>
              <Text style={styles.onboarding_description}>Schedule a reminder notification for the day 
               before your bin collection day</Text>
            </View>
            <Text style={styles.onboarding_description}>
            This app is an early release and more features will be added in the
            coming months to support your usage of the Recycling 2.0 service.
              {'\n\n'}
            We are continually improving the app and welcome your feedback.
            
            </Text>
          </View>
        </ScrollView>
          <View style={styles.onboarding_close}>
            <TouchableOpacity style={styles.onboarding_close_button} onPress={handleButton}>
              <Text style={styles.onboarding_close_label}>Get Started</Text>
            </TouchableOpacity>
          </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: { flex: 1 },
  onboarding: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  onboarding_scroll: {
    flex: 1
  },
  onboarding_scroll_content: {
    flexDirection: 'column'
  },
  onboarding_head: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40
  },
  onboarding_image: {
    height: 90,
    width: 320
  },
  onboarding_body: {
    flex: 2,
    justifyContent: 'flex-start',
    padding: 20
  },
  onboarding_welcome: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  onboarding_description: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 25
  },
  onboarding_list: {
    flexDirection:"row",
    alignItems:"flex-start",
    width: "90%",
  },
  onboarding_list_item: {
    marginTop: 10,
    marginHorizontal: 10,
    fontSize: 16,
    lineHeight: 25
  },
  onboarding_close: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 25,
    paddingBottom: 30,
    paddingHorizontal: 20
  },
  onboarding_close_button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#1352A5'
  },
  onboarding_close_label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  }
});
