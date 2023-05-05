import React, {ReactNode, useCallback} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

interface INavTile {
  label: string | JSX.Element;
  onPress: () => void;
  children?: ReactNode;
}

const NavTile: React.FC<INavTile> = ({label, onPress, children}) => {
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.tile}>{children}</View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default NavTile;

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'column',
    alignItems: 'center',
    //backgroundColor: '#ebebeb',
    borderRadius: 12,
    borderColor: '#e0dddd',
    borderWidth: 2,
    minWidth: 130,
    minHeight: 140,
  },
  icon: {
    width: 51,
    height: 80,
  },
  text: {
    fontSize: 14,
    marginTop: 5,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
});
