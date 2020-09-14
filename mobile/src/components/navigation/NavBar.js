import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import images from '../../utils/images';

export default (props) => {
  const { navigation, route } = props;
  const handleBurger = useCallback(() => navigation.openDrawer(), []);
  const handleBackButton = useCallback(() => navigation.goBack(), []);

	return (
		<View style={styles.home_head}>
      {navigation.canGoBack() &&(
        <TouchableOpacity style={styles.item_button} onPress={handleBackButton}>
          <Text><Icon name='arrow-left' size={24} color='#212121' /></Text>
        </TouchableOpacity>
      )}
		  <TouchableOpacity onPress={()=>{navigation.navigate('Home')}}><Image style={styles.home_logo} source={images.hbccLogo} /></TouchableOpacity>
      {!navigation.canGoBack() &&(
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
});
