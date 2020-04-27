import React from 'react';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';
import images from '../../utils/images';
import { getBinImg } from '../../utils';

export default (props) => {
  const { col } = props;
  const { bin_type: binType } = col;

  return (
    <View style={styles.bin}>
      <Image style={styles.bin_img} source={images[getBinImg(binType)]} />
    </View>
  );
};

const styles = StyleSheet.create({
  bin: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10
  },
  bin_img: {
    width: 51,
    height: 80
  }
});
