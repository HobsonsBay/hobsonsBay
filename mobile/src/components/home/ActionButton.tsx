import React from 'react';
import {ViewStyle} from 'react-native';
import {StyleSheet, View, TouchableOpacity} from 'react-native';

interface IActionButton {
  left?: React.ReactNode;
  right?: React.ReactNode;
  color: string;
  onPress: () => void;
  style?: ViewStyle;
  children: React.ReactNode;
}

const ActionButton: React.FC<IActionButton> = ({
  left,
  right,
  color,
  onPress,
  style,
  children,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.button, {backgroundColor: color}, style]}>
        <View style={styles.left}>{left}</View>
        <View style={styles.content}>{children}</View>
        <View style={styles.right}>{right}</View>
      </View>
    </TouchableOpacity>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#aaaaaa',
    borderRadius: 5,
    minHeight: 45,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  content: {
    flexGrow: 1,
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  left: {
    width: 30,
    textAlign: 'center',
  },
  right: {},
});
