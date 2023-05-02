import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface IFootButton {
  icon: string;
  onTouch?: () => void;
  text: string;
  goTo?: string;
  navigation: any;
  onPress?: () => void;
  unread?: boolean;
}

const FootButton: React.FC<IFootButton> = ({
  icon,
  text,
  goTo,
  navigation,
  onPress,
  unread,
}) => {
  return (
    <TouchableOpacity
      onPress={goTo ? () => navigation.navigate(goTo) : onPress}>
      <View style={styles.button}>
        {unread && <View style={styles.unreadDot} />}
        <Icon name={icon} size={26} color="#727272" />
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FootButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  icon: {
    width: 51,
    height: 80,
  },
  text: {
    fontSize: 14,
    marginTop: 5,
  },
  unreadDot: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f00',
  },
});
