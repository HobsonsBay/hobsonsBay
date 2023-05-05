import React from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  
} from 'react-native';
import {connectSearchBox} from 'react-instantsearch/connectors';


interface SearchBoxProps {
  clearFilter: () => void;
  currentRefinement: String;
  displaySuggestions: () => void;
  firstKeystroke: () => void;
  refine: () => void;
  isFirstKeystroke: Boolean;
  filterText: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  currentRefinement,
  displaySuggestions,
  clearFilter,
  refine,
  isFirstKeystroke,
  firstKeystroke,
  filterText,
}) => {
  return (
    <View style={styles.searchBox}>
      <Text>
        <Icon name="search" size={20} color="#424242" />
      </Text>
      <TextInput
        style={styles.searchBox_input}
        value={currentRefinement}
        placeholder="Search for an item"
        placeholderTextColor="#424242"
        clearButtonMode="while-editing"
        spellCheck={false}
        autoCorrect={false}
        autoCapitalize="none"
        maxFontSizeMultiplier={1.2}
        onChange={() => {
          if (isFirstKeystroke) {
            displaySuggestions();
            firstKeystroke();
          }
        }}
        onChangeText={(text) => {
          if (text === '') {
            displaySuggestions(false);
            clearFilter();
          } else {
            displaySuggestions(true);
          }

          refine(text);
          filterText(text);
        }}
      />
    </View>
  );
};

export const ConnectedSearchBox = connectSearchBox(SearchBox);

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
