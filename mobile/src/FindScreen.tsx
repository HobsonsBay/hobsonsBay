import MIcon from 'react-native-vector-icons/MaterialIcons';
import isEmpty from 'lodash/isEmpty';
import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  ScrollView,
  ImageSourcePropType,
} from 'react-native';
import images from './utils/images';
import {openUrl} from './utils';
import {
  RECYCLING_BIN_URL,
  FOGO_BIN_URL,
  RUBBISH_BIN_URL,
  GLASS_BIN_URL,
} from './utils/constants';
import Search from './components/find/Search';
import NavBar from './components/navigation/NavBar';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

interface IFindScreen {
  navigation: StackNavigationProp<any>;
  route: RouteProp<any, any>;
}

const FindScreen: React.FC<IFindScreen> = ({navigation, route}) => {
  const [listener] = useState<{
    kdsListener?: any;
    kdhListener?: any;
  }>({});
  const [showAll, setShowAll] = useState(true);
  const [cleared, setCleared] = useState(true);

  const handleRecyclingClick = useCallback(
    () => openUrl(RECYCLING_BIN_URL),
    [],
  );
  const handleFogoClick = useCallback(() => openUrl(FOGO_BIN_URL), []);
  const handleRubbishClick = useCallback(() => openUrl(RUBBISH_BIN_URL), []);
  const handleGlassClick = useCallback(() => openUrl(GLASS_BIN_URL), []);

  const keyboardDidShow = useCallback(() => setShowAll(false), []);
  const keyboardDidHide = useCallback(() => setShowAll(true), []);

  // const handleBurger = useCallback(() => navigation.openDrawer(), []);
  const handleSelection = useCallback(
    (item: string) => navigation.push('Item', {item}),
    [navigation],
  );
  const filterText = useCallback(
    (text: string) => setCleared(isEmpty(text)),
    [],
  );

  useEffect(() => {
    listener.kdsListener = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShow,
    );
    listener.kdhListener = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide,
    );
    return () => {
      listener.kdsListener.remove();
      listener.kdhListener.remove();
    };
  }, [keyboardDidHide, keyboardDidShow, listener]);

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.find}>
        <NavBar navigation={navigation} route={route} />

        <ScrollView
          style={styles.find_scroll}
          contentContainerStyle={styles.find_scroll_content}>
          <View style={styles.find_body}>
            <Text style={styles.find_title}>Which bin does this go in?</Text>
            <View style={styles.find_search}>
              <Search
                handleSelection={handleSelection}
                filterText={filterText}
              />
            </View>
          </View>
          {showAll && cleared && (
            <View style={styles.find_binInfo}>
              <Text style={styles.find_binInfo_label}>Bin Info</Text>
              <Text style={styles.find_binInfo_text}>
                Find out how to use your bins when you click the links to our
                website
              </Text>
            </View>
          )}
          {showAll && cleared && (
            <View style={styles.find_links}>
              <TouchableOpacity
                style={styles.find_link_button}
                onPress={handleRecyclingClick}>
                <Image
                  style={styles.find_link_img}
                  source={images.recyclingNT as ImageSourcePropType}
                />
                <View style={styles.find_link_detail}>
                  <Text style={styles.find_link_label}>Mixed Recycling</Text>
                  <Text style={styles.find_link_info}>
                    Collected Fortnightly
                  </Text>
                </View>
                <Text>
                  <MIcon name="launch" size={18} color="#1352A5" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.find_link_button}
                onPress={handleFogoClick}>
                <Image
                  style={styles.find_link_img}
                  source={images.fogoNT as ImageSourcePropType}
                />
                <View style={styles.find_link_detail}>
                  <Text style={styles.find_link_label}>Food and Garden</Text>
                  <Text style={styles.find_link_info}>Collected Weekly</Text>
                </View>
                <Text>
                  <MIcon name="launch" size={18} color="#1352A5" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.find_link_button}
                onPress={handleRubbishClick}>
                <Image
                  style={styles.find_link_img}
                  source={images.rubbishNT as ImageSourcePropType}
                />
                <View style={styles.find_link_detail}>
                  <Text style={styles.find_link_label}>Rubbish</Text>
                  <Text style={styles.find_link_info}>
                    Collected Fortnightly
                  </Text>
                </View>
                <Text>
                  <MIcon name="launch" size={18} color="#1352A5" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.find_link_button}
                onPress={handleGlassClick}>
                <Image
                  style={styles.find_link_img}
                  source={images.glassNT as ImageSourcePropType}
                />
                <View style={styles.find_link_detail}>
                  <Text style={styles.find_link_label}>Glass</Text>
                  <Text style={styles.find_link_info}>
                    Collected every four weeks
                  </Text>
                </View>
                <Text>
                  <MIcon name="launch" size={18} color="#1352A5" />
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FindScreen;

const styles = StyleSheet.create({
  view: {flex: 1},
  find: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  find_scroll: {
    flex: 1,
  },
  find_scroll_content: {
    flexDirection: 'column',
  },
  find_body: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  find_title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  find_search: {
    marginTop: 20,
  },
  find_binInfo: {
    flexDirection: 'column',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  find_binInfo_label: {
    fontSize: 22,
    color: '#212121',
  },
  find_binInfo_text: {
    marginTop: 2,
    fontSize: 16,
    color: '#424242',
    letterSpacing: 0.5,
  },
  find_links: {
    flexDirection: 'column',
    marginTop: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  find_link_button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#9e9e9e',
  },
  find_link_img: {
    width: 40,
    height: 46,
    marginRight: 10,
  },
  find_link_detail: {
    flex: 1,
  },
  find_link_label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#424242',
    letterSpacing: 0.5,
  },
  find_link_info: {
    fontSize: 15,
    color: '#616161',
    letterSpacing: 0.5,
  },
});
