import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Keyboard
} from 'react-native';
import images from './utils/images';
import { openUrl } from './utils';
import { POLICY_URL } from './utils/constants';
import Search from './components/address/Search';
import { useData } from './utils/DataContext'
import NavBar from "./components/navigation/NavBar";

export default (props) => {
  const { setAddress } = useData();
  const { navigation } = props;
  const [listener] = useState({});
  const [showAll, setShowAll] = useState(true);
  const handlePolicyClick = openUrl(POLICY_URL);
  const keyboardDidShow = useCallback(() => setShowAll(false), []);
  const keyboardDidHide = useCallback(() => setShowAll(true), []);
  const handleBurger = useCallback(() => navigation.openDrawer(), []);

  const handleSelection = useCallback((address) => {
    AsyncStorage.setItem('address', JSON.stringify(address)).then(() => {
      setAddress(address["Property Address"])
      address && navigation.push('Schedule', { address });
    }).catch(console.error);
  }, []);

  useEffect(() => {
    listener.kdsListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    listener.kdhListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    return () => {
      listener.kdsListener.remove();
      listener.kdhListener.remove();
    };
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('address').then((value) => {
      const address = JSON.parse(value);
      address && navigation.push('Schedule', { address });
    }).catch(console.error);
  }, []);

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.address}>
        <NavBar navigation={navigation}/>

        <View style={styles.address_body}>
          <Text style={styles.address_title}>Find your bin day</Text>
          <View style={styles.address_search}>
            <Search handleSelection={handleSelection} />
          </View>
          {showAll &&
            <View style={styles.address_banner}>
              <Image style={styles.address_recycling_logo} source={images.recyclingLogo} />
            </View>}
        </View>
        {showAll &&
          <TouchableOpacity style={styles.address_policy} onPress={handlePolicyClick}>
            <Text style={styles.address_policy_text}>Privacy Policy</Text>
            <Text><MIcon name='launch' size={22} color='#1051a4' /></Text>
          </TouchableOpacity>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: { flex: 1 },
  address: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  address_body: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  address_title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121'
  },
  address_search: {
    height: 256,
    marginTop: 20
  },
  address_banner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  address_recycling_logo: {
    height: 128,
    width: 160
  },
  address_policy: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40
  },
  address_policy_text: {
    marginRight: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1051a4'
  }
});
