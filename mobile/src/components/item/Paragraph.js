import map from 'lodash/map';
import trim from 'lodash/trim';
import startWith from 'lodash/startsWith';
import React, {
  useEffect,
  useState
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { getTokens, openUrl, LINK } from '../../utils';

export default (props) => {
  const { text } = props;
  const [strings, setStrings] = useState([]);

  useEffect(() => {
    const tokens = getTokens(trim(text));
    setStrings(tokens);
  }, [text]);

  return (
    <View style={styles.paragraph}>
      {map(strings, (str, i) => !startWith(str, LINK)
        ? <Text key={i} style={styles.paragraph_text}>{strings[i]}</Text>
        : (
          <TouchableOpacity key={i} onPress={openUrl(strings[i])}>
            <Text style={styles.paragraph_link}>{strings[i]}</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    flexDirection: 'column'
  },
  paragraph_text: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 1
  },
  paragraph_link: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 1,
    color: '#1051a4'
  }
});
