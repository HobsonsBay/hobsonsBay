import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import images from '../../utils/images';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default (props) => {
  const { icon, onTouch, text, goTo, navigation, onPress, unread } = props;

  return (
    <TouchableOpacity onPress={ goTo ? React.useCallback(() => navigation.navigate(goTo)) : onPress }>
      <View style={styles.button}>
        {unread && (
          <View style={styles.unreadDot}></View>
        )}
        <Icon name={icon} size={26} color='#727272' />
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10
  },
  icon: {
    width: 51,
    height: 80
  },
  text: {
    fontSize: 14,
    marginTop: 5
  },
  unreadDot:{
    position: 'absolute',
    right: 8,
    top: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#f00"
  }
});
