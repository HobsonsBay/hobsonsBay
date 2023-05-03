import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Linking
} from 'react-native';
import format from 'date-fns/format';
import images from '../../utils/images';
import { style } from "../../utils/styles";
import { ListItem, Br, Head, Para, LinkButton, LinkText } from "../../utils/Typography";

export default (props) => {
  const {index, findDimensions, width, tip, colour} = props;

  return (
      <View width={width} style={[styles.tip_container,{backgroundColor: colour}]} onLayout={(event) => findDimensions(index, event.nativeEvent.layout)}>
        <Text style={styles.small_head}>{tip.title}</Text>
        <Para style={styles.centered_text}>
          {tip.tip}
          {tip.credit && tip.credit.length > 0 && (<Text style={styles.italic}><Br/>{tip.credit}</Text>)}
        </Para>
        {tip.did_you_know.length > 0 && (
          <View style={styles.did_you_know}>
            <Text style={styles.small_head}>did you know</Text>
            <Para style={styles.centered_text}>{tip.did_you_know}</Para>
          </View>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  tip_container: {
    position: "relative",
    margin: 20,
    padding: 10,
    backgroundColor: "#aff",
    borderRadius: 10
  },
  small_head:{
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center'
  },
  centered_text:{
    textAlign: 'center'

  },
  did_you_know:{
    marginTop: 8,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 5
  },
  italic:{
    ...style.type.italic,
    marginTop: 8
  }

});
