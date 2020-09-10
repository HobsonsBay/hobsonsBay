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
  const { navigation } = props;
  //console.log(navigation)
  const handleBurger = useCallback(() => navigation.openDrawer(), []);

	return (
		<View style={styles.home_head}>
		  <TouchableOpacity onPress={()=>{navigation.navigate('Home')}}><Image style={styles.home_logo} source={images.hbccLogo} /></TouchableOpacity>
		  <TouchableOpacity style={styles.home_button} onPress={handleBurger}>
		    <Text><Icon name='bars' size={26} color='#212121' /></Text>
		  </TouchableOpacity>
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
