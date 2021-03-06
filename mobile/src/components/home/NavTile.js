import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default (props) => {
  const { label, onPress } = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient colors={['#ebebeb', '#ffffff', '#ffffff']} style={styles.tile}>
          {props.children}
      </LinearGradient>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'column',
    alignItems: 'center',
    //backgroundColor: '#ebebeb',
    borderRadius: 12,
    borderColor: "#e0dddd",
    borderWidth: 2,
    minWidth: 130,
    minHeight: 140
  },
  icon: {
    width: 51,
    height: 80
  },
  text: {
    fontSize: 14,
    marginTop: 5
  },
  label: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center'
  }
});
