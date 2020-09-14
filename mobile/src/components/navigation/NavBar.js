import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import images from '../../utils/images';
import { useNavigation } from '@react-navigation/native';

export default (props) => {
  const navigation = useNavigation();
  const {isHome} = props;
  const goHome = useCallback(()=>{navigation.navigate("Home");})
  const handleBurger = useCallback(() => navigation.openDrawer(), []);
  const handleBackButton = useCallback(() => navigation.goBack(), []);


  // OLD state functions below 

  //const [goBack,setGoBack] = useState(false);

  // const route = useRoute();
  // const handleBackButton = useCallback(() => navigation.goBack(), []);
  // const index = useNavigationState(state => state.index);

  // const goHome = useCallback(()=>{
  //   console.log('home',route.name, index, navigation.canGoBack(), goBack)
  //   if(goBack){
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'Home' }],
  //     });
  //   }
  // },[goBack])

  // useEffect(()=>{
  //   console.log('goback',route.name, index, navigation.canGoBack())
  //   if(index != 0 || navigation.canGoBack()){
  //     setGoBack(true);
  //   }else{
  //     setGoBack(false);
  //   }
  // },[index])

  // useEffect(()=>{
  //   console.log('go back set to',goBack)
  // },[goBack])

  // useEffect(()=>{
  //   console.log('index set to',index)
  // },[index])

  // React.useEffect(() => {
  //   const focus = navigation.addListener('focus', () => {
  //     console.log('trigger nav focus');
  //     if(index != 0 || navigation.canGoBack()){
  //       setGoBack(true);
  //     }else{
  //       setGoBack(false);
  //     }
  //   });

  //   return focus;
  // }, [navigation]);

	return (
		<View style={styles.home_head}>
      {!isHome &&(
        <TouchableOpacity style={styles.back_button} onPress={handleBackButton}>
          <Text><MaterialIcon name='arrow-back' size={32} color='#212121' /></Text>
        </TouchableOpacity>
      )}
		  <TouchableOpacity onPress={goHome}><Image style={styles.home_logo} source={images.hbccLogo} /></TouchableOpacity>
      {isHome &&(
  		  <TouchableOpacity style={styles.home_button} onPress={handleBurger}>
  		    <Text><Icon name='bars' size={26} color='#212121' /></Text>
  		  </TouchableOpacity>
      )}
		</View>
	)
}

const styles = StyleSheet.create({
  home_head: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  home_button: {
    width: 64,
    justifyContent: 'center',
    alignItems: 'center'
  },
  home_logo: { // 1181 × 506
    height: 41,
    width: 95,
    marginLeft: 15
  },
  back_button:{
    padding:10,
  }
});
