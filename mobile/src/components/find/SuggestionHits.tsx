import React, {Component} from 'react';
import PropTypes from 'prop-types';
import algoliasearch from 'algoliasearch/lite';
import {InstantSearch, Configure, Index} from 'react-instantsearch/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {omit} from 'lodash';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Keyboard,
  TouchableHighlight,
  Linking,
} from 'react-native';
import {connectSearchBox, connectHits} from 'react-instantsearch/connectors';
import {ConnectedSearchBox} from './SearchBox';
const config = require('../../config/algolia');

const searchClient = algoliasearch(config.appId, config.apiKey);


export const SuggestionsHits = connectHits(({ hits, handlePressItem }) => {
    if (hits.length === 0) {
      return (
        <View style={styles.suggestions_notFound}>
          <Text style={styles.suggestions_notFound_title}>
            We're not able to find that item
          </Text>
          <Text>
            Try a different word. For example instead of{' '}
            <Text style={styles.suggestions_notFound_bold}>apple</Text> type{' '}
            <Text style={styles.suggestions_notFound_bold}>fruit,</Text> or{' '}
            <Text
              style={{ textDecorationLine: 'underline' }}
              onPress={() =>
                Linking.openURL(
                  'https://www.hobsonsbay.vic.gov.au/Council/Contact-us',
                )
              }>
              Contact Us
            </Text>{' '}
            to suggest an item.
          </Text>
        </View>
      );
    }
  
    return (
      <FlatList
        data={hits.reduce((acc, hit) => {
          acc.push(hit);
          return acc;
        }, [])}
        renderItem={({ item, index }) => {
          return (
            <Item index={index} item={item} handlePressItem={handlePressItem} />
          );
        }}
        keyExtractor={(item, index) => item.objectID + index}
        keyboardShouldPersistTaps="always"
      />
    );
  });
  
  type ItemProps = {
    item: any;
    index: number;
    handlePressItem: (name: string, item: any) => void;
  };
  
  const Item: React.FC<ItemProps> = ({ item, handlePressItem }) => {
    const attribute = 'Item Name';
  
    return (
      <TouchableHighlight
        onPress={() => {
          Keyboard.dismiss();
          handlePressItem(item[attribute], item);
        }}
        underlayColor="#fff">
        <View style={styles.suggestions_row}>
          <Text style={styles.suggestions_row_text}>{item[attribute]}</Text>
        </View>
      </TouchableHighlight>
    );
  };
  
  const styles = StyleSheet.create({
    search: {
      flex: 1,
      backgroundColor: '#fff'
    },
    searchBox: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 10,
      backgroundColor: '#f5f5f5',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#757575',
      marginBottom: 10
    },
    searchBox_input: {
      height: 50,
      width: 300,
      marginLeft: 10,
      color: 'black',
      fontSize: 16
    },
    suggestions_row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingLeft: 5
    },
    suggestions_row_text: {
      fontSize: 18
    },
    suggestions_notFound: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#FFEBEE',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#FFCDD2'
    },
    suggestions_notFound_title: {
      marginBottom: 10
    },
    suggestions_notFound_bold: {
      fontWeight: 'bold'
    }
  });