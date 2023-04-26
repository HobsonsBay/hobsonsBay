import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import images from '../../utils/images';
import {getBinImg} from '../../utils';

interface IBin {
  col: any;
}

const Bin: React.FC<IBin> = ({col}) => {
  const {bin_type: binType} = col;

  return (
    <View accessible accessibilityLabel={binType} style={styles.bin}>
      <Image style={styles.bin_img} source={images[getBinImg(binType)]} />
    </View>
  );
};

export default Bin;

const styles = StyleSheet.create({
  bin: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  bin_img: {
    width: 51,
    height: 80,
  },
});
