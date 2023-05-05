import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Keyboard,
  TouchableHighlight,
  Linking,
} from 'react-native';
import {connectHits} from 'react-instantsearch/connectors';

interface SuggestionsHitsProps {
  hits: any[];
  handlePressItem: (address: string, item: any) => void;
}

export const SuggestionsHits = connectHits(
  ({hits, handlePressItem}: SuggestionsHitsProps) => {
    console.log('Hits', hits);
    const Item: React.FC<{item: any}> = ({item}) => {
      const attribute = 'Property Address';

      return (
        <TouchableHighlight
          onPress={() => {
            Keyboard.dismiss();
            handlePressItem(item[attribute], item);
          }}
          underlayColor="#fff">
          <View style={styles.suggestions_row}>
            <Text>{item[attribute]}</Text>
          </View>
        </TouchableHighlight>
      );
    };

    if (hits?.length === 0) {
      return (
        <View style={styles.suggestions_notFound}>
          <Text style={styles.suggestions_notFound_title}>
            We're not able to find that address
          </Text>
          <Text>
            Check that the address is within the{' '}
            <Text style={styles.suggestions_notFound_bold}>
              Hobsons Bay Area
            </Text>{' '}
            or{' '}
            <Text
              style={{textDecorationLine: 'underline'}}
              onPress={() =>
                Linking.openURL(
                  'https://www.hobsonsbay.vic.gov.au/Council/Contact-us',
                )
              }>
              Contact Us
            </Text>
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={hits?.reduce((acc, hit) => {
          acc.push(hit);
          return acc;
        }, [])}
        renderItem={({item, index}) => {
          return (
            <Item index={index} item={item} handlePressItem={handlePressItem} />
          );
        }}
        keyExtractor={(item, index) => item.objectID + index}
        keyboardShouldPersistTaps="always"
      />
    );
  },
);

const styles = StyleSheet.create({
  search: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  searchBox_input: {
    height: 50,
    width: 300,
    marginLeft: 10,
    color: 'black',
  },
  suggestions_row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 40,
  },
  suggestions_notFound: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  suggestions_notFound_title: {
    marginBottom: 10,
  },
  suggestions_notFound_bold: {
    fontWeight: 'bold',
  },
});
