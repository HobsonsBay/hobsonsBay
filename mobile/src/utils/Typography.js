import React, {
  Component
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { style } from "./styles";
import MIcon from 'react-native-vector-icons/MaterialIcons';

const ListItem = (props) => {
  return (
	<View style={styles.onboarding_list}>
	  <Text style={styles.onboarding_list_item}>{'\u2022'}</Text>
	  <Text style={props.style}>{props.children}</Text>
	</View>
  );
}

const Br = () => {
	return <Text>{"\n"}</Text>;
}

const Head = (props) => {
  const size = props.size || 'medium';
  return <Text style={{...props.style,...style.type.headings[size]}}>{props.children}</Text>;
}

const Para = (props) => {
  const size = props.size || 'default';
  return <Text style={{...props.style,...style.type.paras[size]}}>{props.children}</Text>;
}

const LinkButton = (props) => {
  return(
    <TouchableOpacity style={styles.about_link_button} onPress={props.onPress}>
      <Text style={styles.about_link_label}>{props.children}</Text>
      <Text><MIcon name='launch' size={18} color='#1352A5' /></Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  onboarding_list: {
    flexDirection:"row",
    alignItems:"flex-start",
    width: "90%",
  },
  onboarding_list_item: {
    marginTop: 10,
    marginHorizontal: 10,
    fontSize: 16,
    lineHeight: 25
  },
  about_link_button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#9e9e9e'
  },
  about_link_label: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1352A5'
  }
})

export { style, ListItem, Br, Head, Para, LinkButton };