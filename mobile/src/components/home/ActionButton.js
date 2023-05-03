import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

export default (props) => {
  const { left, right, color, onPress } = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.button,{backgroundColor: props.color }]}>
        <View style={styles.left}>{left}</View>
        <View style={styles.content}>{props.children}</View>
        <View style={styles.right}>{right}</View>
      </View>
    </TouchableOpacity>
  );
};

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
  content:{
    flexGrow: 1,
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: "#ffffff"
  },
  left: {
    width: 30,
    textAlign: 'center'
  }
});
