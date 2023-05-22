import React, {useState} from 'react';
import Config from 'react-native-config'
import algoliasearch from 'algoliasearch/lite';
import {InstantSearch, Configure, Index} from 'react-instantsearch/native';

import {StyleSheet, View} from 'react-native';
import {ConnectedSearchBox} from './SearchBox';
import {SuggestionsHits} from './SuggestionHits';

const config = require('../../config/algolia');

const searchClient = algoliasearch(Config.ALGOLIA_APPID, Config.ALGOLIA_API_KEY);

interface SearchProps {
  handleSelection?: (item: any) => void;
}

const Search: React.FC<SearchProps> = (props) => {
  const [displaySuggestions, setDisplaySuggestions] = useState(false);
  const [isFirstKeystroke, setIsFirstKeystroke] = useState(true);
  const [searchState, setSearchState] = useState({});
  const [query, setQuery] = useState('');

  const firstKeystroke = () => {
    setIsFirstKeystroke(false);
  };

  const displaySuggestionsFunc = (value = true) => {
    setDisplaySuggestions(value);
  };

  const setQueryFunc = (query: string, item: any) => {
    const updatedSearchState = {
      ...searchState,
      indices: {
        ...searchState.indices,
        addresses: {
          ...searchState.indices?.addresses,
          page: 0,
        },
      },
    };

    if (props.handleSelection) {
      props.handleSelection(item);
    }

    setQuery('');
    setSearchState(updatedSearchState);
    setDisplaySuggestions(false);
  };

  const clearFilter = () => {
    setQuery('');
  };

  const handleSearchStateChange = (searchState: any) => {
    setSearchState(searchState);
  };

  return (
    <View style={styles.search}>
      <InstantSearch
        searchClient={searchClient}
        indexName="addresses"
        onSearchStateChange={handleSearchStateChange}
        searchState={searchState}>
        <ConnectedSearchBox
          displaySuggestions={(arg: boolean | undefined) =>
            displaySuggestionsFunc(arg)
          }
          firstKeystroke={firstKeystroke}
          isFirstKeystroke={isFirstKeystroke}
          defaultRefinement={query}
          clearFilter={clearFilter}
        />
        <Index indexName="addresses">
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
