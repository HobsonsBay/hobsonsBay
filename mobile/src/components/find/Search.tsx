import React, {useState} from 'react';

import algoliasearch from 'algoliasearch/lite';
import {InstantSearch, Configure, Index} from 'react-instantsearch/native';

import {omit} from 'lodash';
import {StyleSheet, View} from 'react-native';

import {ConnectedSearchBox} from './SearchBox';
import {SuggestionsHits} from './SuggestionHits';
const config = require('../../config/algolia');

const searchClient = algoliasearch(config.appId, config.apiKey);

type SearchProps = {
  handleSelection?: (item: any) => void;
  filterText?: (text: string) => void;
};

const Search: React.FC<SearchProps> = (props) => {
  const [displaySuggestions, setDisplaySuggestions] = useState(false);
  const [isFirstKeystroke, setIsFirstKeystroke] = useState(true);
  const [searchState, setSearchState] = useState({});
  const [query, setQuery] = useState('');

  const firstKeystroke = () => {
    setIsFirstKeystroke(false);
  };

  const handleSearchStateChange = (newSearchState: any) => {
    setSearchState(newSearchState);
  };

  const displaySuggestionsFunc = (value = true) => {
    setDisplaySuggestions(value);
  };

  const removeSuggestions = () => {
    setDisplaySuggestions(false);
    setIsFirstKeystroke(true);
  };

  const setQueryFunc = (query: string, item: any) => {
    const newSearchState = omit(searchState, ['query', 'page']);

    if (newSearchState.indices && newSearchState.indices.items) {
      newSearchState.indices.items.page = 0;
    }

    props.handleSelection && props.handleSelection(item);
    setQuery(query);
    setSearchState(newSearchState);
    setDisplaySuggestions(true);
  };

  const setText = (text: string) => {
    props.filterText && props.filterText(text);
  };

  const clearFilter = () => {
    setQuery('');
  };

  return (
    <View style={styles.search}>
      <InstantSearch
        searchClient={searchClient}
        indexName="items"
        onSearchStateChange={handleSearchStateChange}
        searchState={searchState}>
        <ConnectedSearchBox
          displaySuggestions={displaySuggestionsFunc}
          firstKeystroke={firstKeystroke}
          isFirstKeystroke={isFirstKeystroke}
          defaultRefinement={query}
          clearFilter={clearFilter}
          filterText={setText}
        />
        <Index indexName="items">
          <Configure hitsPerPage={4} />
          {displaySuggestions && (
            <SuggestionsHits handlePressItem={setQueryFunc} />
          )}
        </Index>
      </InstantSearch>
    </View>
  );
};

export default Search;

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
    borderWidth: 1,
    borderColor: '#757575',
    marginBottom: 10,
  },
  searchBox_input: {
    height: 50,
    width: 300,
    marginLeft: 10,
    color: 'black',
    fontSize: 16,
  },
  suggestions_row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 5,
  },
  suggestions_row_text: {
    fontSize: 18,
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
