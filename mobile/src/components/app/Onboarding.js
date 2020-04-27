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
    AsyncStorage.setItem('onboarded', JSON.stringify(true)).then(() => {
      setModalVisible(false);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('onboarded').then((value) => {
      const onboarded = JSON.parse(value);
      !onboarded && setModalVisible(true);
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
            Hobsons Bay City Council’s kerbside waste and recycling service
            redirects household waste from landfill into local recycling streams.
              {'\n\n'}
            This app is an early release and more features will be added in the
            coming months to support your usage of the Recycling 2.0 service.
              {'\n\n'}
            We are continually improving the app and welcome your feedback.
            </Text>
          </View>
          <View style={styles.onboarding_close}>
            <TouchableOpacity style={styles.onboarding_close_button} onPress={handleButton}>
              <Text style={styles.onboarding_close_label}>Find your bin day</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  onboarding_close: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 30,
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
