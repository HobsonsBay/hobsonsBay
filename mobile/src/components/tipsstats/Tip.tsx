import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {style} from '../../utils/styles';
import {Br, Para} from '../../utils/Typography';

interface ITip {
  index: number;
  findDimensions: (index: number, layout: object) => void;
  width: number;
  tip: any;
  colour: string;
  category?: any;
}

const Tip: React.FC<ITip> = ({index, findDimensions, width, tip, colour}) => {
  return (
    <View
      // width={width}
      style={[styles.tip_container, {backgroundColor: colour, width: width}]}
      onLayout={(event) => findDimensions(index, event.nativeEvent.layout)}>
      <Text style={styles.small_head}>{tip.title}</Text>
      <Para style={styles.centered_text}>
        {tip.tip}
        {tip.credit && tip.credit.length > 0 && (
          <Text style={styles.italic}>
            <Br />
            {tip.credit}
          </Text>
        )}
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

export default Tip;

const styles = StyleSheet.create({
  tip_container: {
    position: 'relative',
    margin: 20,
    padding: 10,
    backgroundColor: '#aff',
    borderRadius: 10,
  },
  small_head: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  centered_text: {
    textAlign: 'center',
  },
  did_you_know: {
    marginTop: 8,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 5,
  },
  italic: {
    ...style.type.italic,
    marginTop: 8,
  },
});
