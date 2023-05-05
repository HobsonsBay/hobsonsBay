import React, {useCallback} from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import images from '../../utils/images';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {StackNavigationProp} from '@react-navigation/stack';

interface INavBar {
  isHome?: boolean;
  quiz?: boolean;
  backButtonAction?: () => void;
  navigation?: StackNavigationProp<any>;
  route?: RouteProp<any, any>;
}

const NavBar: React.FC<INavBar> = ({isHome, quiz, backButtonAction}) => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  const goHome = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const handleBurger = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  const handleBackButton = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.home_head}>
      {!isHome && !quiz && (
        <TouchableOpacity style={styles.back_button} onPress={handleBackButton}>
          <Text>
            <MaterialIcon name="arrow-back" size={32} color="#212121" />
          </Text>
        </TouchableOpacity>
      )}
      {quiz && (
        <TouchableOpacity style={styles.back_button} onPress={backButtonAction}>
          <Text>
            <MaterialIcon name="arrow-back" size={32} color="#212121" />
          </Text>
        </TouchableOpacity>
      )}
      {!quiz && (
        <TouchableOpacity onPress={goHome}>
          <Image style={styles.home_logo} source={images.hbccLogo} />
        </TouchableOpacity>
      )}
      {quiz && (
        <TouchableOpacity onPress={backButtonAction}>
          <Image style={styles.home_logo} source={images.hbccLogo} />
        </TouchableOpacity>
      )}
      {isHome && (
        <TouchableOpacity style={styles.home_button} onPress={handleBurger}>
          <Text>
            <Icon name="bars" size={26} color="#212121" />
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  home_head: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  home_button: {
    width: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  home_logo: {
    // 1181 × 506
    height: 41,
    width: 95,
    marginLeft: 15,
  },
  back_button: {
    padding: 10,
  },
});
