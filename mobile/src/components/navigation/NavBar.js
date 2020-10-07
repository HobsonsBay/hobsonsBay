import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import images from '../../utils/images';
import { useNavigation } from '@react-navigation/native';

export default (props) => {
  const navigation = useNavigation();
  const {isHome, quiz, backButtonAction} = props;
  const goHome = useCallback(()=>{navigation.navigate("Home");})
  const handleBurger = useCallback(() => navigation.openDrawer(), []);
  const handleBackButton = useCallback(() => navigation.goBack(), []);

	return (
		<View style={styles.home_head}>
      {!isHome && !quiz && (
        <TouchableOpacity style={styles.back_button} onPress={handleBackButton}>
          <Text><MaterialIcon name='arrow-back' size={32} color='#212121' /></Text>
        </TouchableOpacity>
      )}
      {quiz && (
        <TouchableOpacity style={styles.back_button} onPress={backButtonAction}>
          <Text><MaterialIcon name='arrow-back' size={32} color='#212121' /></Text>
        </TouchableOpacity>
      )}
      {!quiz && (<TouchableOpacity onPress={goHome}><Image style={styles.home_logo} source={images.hbccLogo} /></TouchableOpacity>)}
      {quiz && (<TouchableOpacity onPress={backButtonAction}><Image style={styles.home_logo} source={images.hbccLogo} /></TouchableOpacity>)}
      {isHome &&(
  		  <TouchableOpacity style={styles.home_button} onPress={handleBurger}>
  		    <Text><Icon name='bars' size={26} color='#212121' /></Text>
  		  </TouchableOpacity>
      )}
		</View>
	)
}

const styles = StyleSheet.create({
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
  home_logo: { // 1181 × 506
    height: 41,
    width: 95,
    marginLeft: 15
  },
  back_button:{
    padding:10,
  }
});
