import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ImageBackground
} from 'react-native';
import images from '../../utils/images';

export default (props) => {
  const { label, binDays } = props;



  return (
    <View style={styles.tile}>
      <ImageBackground source={images.r2Bins} style={{width: 698 * 0.15, height: 472 * 0.15}}>
        <Text style={styles.bignumber}>?</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'column',
    alignItems: 'center',
    width: "100%",
    flex: 1,
    justifyContent: 'center'
  },
  bignumber: {
    fontWeight: 'bold',
    fontSize: 72,
    textAlign: 'center'
    //backgroundColor: "#333"
  },
});
