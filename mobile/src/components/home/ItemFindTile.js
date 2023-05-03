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
      <ImageBackground source={images.r2BinSearch} style={{width: 384 * 0.25, height: 268 * 0.25}}>
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
});
