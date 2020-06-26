import React, { Component } from 'react';
import PropTypes from 'prop-types';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure, Index } from 'react-instantsearch/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { omit } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Keyboard,
  TouchableHighlight,
  Linking
} from 'react-native';
import {
  connectSearchBox,
  connectHits
} from 'react-instantsearch/connectors';

const config = require('../../config/algolia');

const searchClient = algoliasearch(
  config.appId,
  config.apiKey
);

class SearchBox extends Component {
  render () {
    return (
      <View style={styles.searchBox}>
        <Text><Icon name='search' size={20} color='#424242' /></Text>
        <TextInput
          style={styles.searchBox_input}
          value={this.props.currentRefinement}
          placeholder='Type in your address e.g. 15/29 Schutt St'
          placeholderTextColor='#424242'
          clearButtonMode='always'
          spellCheck={false}
          autoCorrect={false}
          autoCapitalize='none'
          onFocus={(arg) => this.props.displaySuggestions(arg)}
          onChangeText={(text) => {
            if (text === '') {
              this.props.displaySuggestions(false);
              this.props.clearFilter();
            } else { this.props.displaySuggestions(true); }

            this.props.refine(text);
          }}
          onChange={() => {
            if (this.props.isFirstKeystroke) {
              this.props.displaySuggestions();
              this.props.firstKeystroke();
            }
          }}
        />
      </View>
    );
  }
}

SearchBox.propTypes = {
  currentRefinement: PropTypes.string,
  displaySuggestions: PropTypes.func,
  firstKeystroke: PropTypes.func,
  refine: PropTypes.func,
  isFirstKeystroke: PropTypes.bool,
  clearFilter: PropTypes.func
};

const ConnectedSearchBox = connectSearchBox(SearchBox);

const SuggestionsHits = connectHits(({ hits, handlePressItem }) => {
  if (hits.length === 0) {
    return (
      <View style={styles.suggestions_notFound}>
        <Text style={styles.suggestions_notFound_title}>We're not able to find that address</Text>
        <Text>
            Check that the address is within the <Text style={styles.suggestions_notFound_bold}>Hobsons Bay Area</Text> or <Text style={{textDecorationLine: 'underline'}}
                  onPress={() => Linking.openURL('https://www.hobsonsbay.vic.gov.au/Council/Contact-us')}>
              Contact Us
            </Text>
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
          <Item
            index={index}
            item={item}
            handlePressItem={handlePressItem}
          />
        );
      }}
      keyExtractor={(item, index) => item.objectID + index}
      keyboardShouldPersistTaps='always'
    />
  );
});

const Item = ({ item, handlePressItem }) => {
  const attribute = 'Property Address';

  return (
    <TouchableHighlight
      onPress={() => {
        Keyboard.dismiss();
        handlePressItem(item[attribute], item);
      }}
      underlayColor='#fff'
    >
      <View style={styles.suggestions_row}>
        <Text>{item[attribute]}</Text>
      </View>
    </TouchableHighlight>
  );
};

Item.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number,
  handlePressItem: PropTypes.func
};

export default class Search extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      displaySuggestions: false,
      isFirstKeystroke: true,
      searchState: {},
      query: ''
    };
    this.displaySuggestions = this.displaySuggestions.bind(this);
    this.removeSuggestions = this.removeSuggestions.bind(this);
    this.setQuery = this.setQuery.bind(this);
    this.handleSearchStateChange = this.handleSearchStateChange.bind(this);
    this.firstKeystroke = this.firstKeystroke.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  firstKeystroke () {
    this.setState({ isFirstKeystroke: false });
  }

  displaySuggestions (value = true) {
    this.setState({ displaySuggestions: value });
  }

  removeSuggestions () {
    this.setState({ displaySuggestions: false, isFirstKeystroke: true });
  }

  setQuery (query, item) {
    const searchState = omit(this.state.searchState, ['query', 'page']);

    if (searchState.indices && searchState.indices.addresses) {
      searchState.indices.addresses.page = 0;
    }

    this.props.handleSelection && this.props.handleSelection(item);
    this.setState({ query: '', searchState, displaySuggestions: false });
  }

  clearFilter () {
    this.setState({ query: '' });
  }

  handleSearchStateChange (searchState) {
    this.setState({ searchState });
  }

  render () {
    const { displaySuggestions } = this.state;

    return (
      <View style={styles.search}>
        <InstantSearch
          searchClient={searchClient}
          indexName='addresses'
          onSearchStateChange={this.handleSearchStateChange}
          searchState={this.state.searchState}
        >
          <ConnectedSearchBox
            displaySuggestions={this.displaySuggestions}
            firstKeystroke={this.firstKeystroke}
            isFirstKeystroke={this.state.isFirstKeystroke}
            defaultRefinement={this.state.query}
            clearFilter={this.clearFilter}
          />
          <Index indexName='addresses'>
            <Configure hitsPerPage={4} />
            {displaySuggestions &&
              <SuggestionsHits handlePressItem={this.setQuery} />}
          </Index>
        </InstantSearch>
      </View>
    );
  }
}

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
    borderRadius: 5
  },
  searchBox_input: {
    height: 50,
    width: 300,
    marginLeft: 10,
    color: 'black'
  },
  suggestions_row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 40
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
