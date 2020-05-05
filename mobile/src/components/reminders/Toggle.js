import Icon from 'react-native-vector-icons/FontAwesome';
import React, {
  useEffect,
  useState
} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

export default (props) => {
  const { style, disabled, value, onPress, onChange } = props;
  const [inactive, setInactive] = useState(disabled);
  const [status, setStatus] = useState(value);
  const onPressToggle = () => {
    !inactive && onChange(!status);
    onPress();
  };

  useEffect(() => {
    setInactive(disabled);
  }, [disabled]);
  
  useEffect(() => {
    setStatus(value);
  }, [value]);

  return (
    <TouchableOpacity style={[styles.toggle, style]} onPress={onPressToggle} activeOpacity={0.8}>
      { status ?
          <Text><Icon name='toggle-on' size={50} color='#1976D2' /></Text>
          :
          <Text><Icon name='toggle-off' size={50} color={disabled ? '#e0e0e0' : '#757575'} /></Text>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'column'
  }
});
