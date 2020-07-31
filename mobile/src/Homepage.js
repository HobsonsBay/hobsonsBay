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
import FootButton from './components/home/FootButton';
import images from './utils/images';
import { openUrl } from './utils';
import { style } from "./utils/styles";
import { ListItem, Br, Head, Para, LinkButton } from "./utils/Typography";

export default (props) => {
  const { navigation } = props;
  const handleBurger = useCallback(() => navigation.openDrawer(), []);
  
  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.homepage}>
        <View style={styles.home_head}>
          <TouchableOpacity style={styles.home_button} onPress={handleBurger}>
            <Text><Icon name='bars' size={26} color='#212121' /></Text>
          </TouchableOpacity>
          <Image style={styles.home_logo} source={images.hbccLogo} />
        </View>
        <ScrollView>
          <View style={styles.home_body}>
            <Text>Homepage</Text>
            <View style={styles.home_2up_wrap}>
              <View style={styles.home_2up_left}>
                <Text>Schedule Tile</Text>
              </View>
              <View style={styles.home_2up_right}>
                <Text>Items Tile</Text>
              </View>
            </View>
            <View style={styles.button_stack}>
              <View style={styles.button}>
                <Text>Address Button</Text>
              </View>
              <View style={styles.button}>
                <Text>Notifications Button</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer_wrap}>
          <View style={styles.footer_button}>
            <FootButton icon='recycle' text="About"/>
          </View>
          <View style={styles.footer_button}>
            <FootButton icon='phone' text="Contact"/>
          </View>
          <View style={styles.footer_button}>
            <FootButton icon='edit' text="Feedback"/>
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
    backgroundColor: '#fff'
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
    marginRight: 15
  },
  home_body: {
    padding: 20
  },
  home_2up_wrap: {
    flexDirection: "row",
    justifyContent: "space-around"
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
