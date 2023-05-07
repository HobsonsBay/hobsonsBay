import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  ImageSourcePropType,
} from 'react-native';
import images from '../../utils/images';

interface IItemFindTile {
  label?: string;
  binDays?: string[];
}

const ItemFindTile: React.FC<IItemFindTile> = () => {
  return (
    <View style={styles.tile}>
      <ImageBackground
        source={images.r2BinSearch as ImageSourcePropType}
        style={{width: 384 * 0.25, height: 268 * 0.25}}
      />
    </View>
  );
};

export default ItemFindTile;

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
});
