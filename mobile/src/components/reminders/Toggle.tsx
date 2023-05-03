import Icon from 'react-native-vector-icons/FontAwesome';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

type IToggle = {
  style?: any;
  disabled: boolean;
  value: boolean;
  onPress: () => void;
  onChange: (value: boolean) => void;
};

const Toggle: React.FC<IToggle> = ({
  style,
  disabled,
  value,
  onPress,
  onChange,
}) => {
  const [inactive, setInactive] = useState<boolean>(disabled);
  const [status, setStatus] = useState<boolean>(value);

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
    <TouchableOpacity
      style={[styles.toggle, style]}
      onPress={onPressToggle}
      activeOpacity={0.8}
      disabled={inactive}>
      {status ? (
        <Text>
          <Icon name="toggle-on" size={50} color="#1976D2" />
        </Text>
      ) : (
        <Text>
          <Icon
            name="toggle-off"
            size={50}
            color={disabled ? '#e0e0e0' : '#757575'}
          />
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Toggle;

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'column',
  },
});
