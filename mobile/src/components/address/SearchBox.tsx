import React from 'react';


import Icon from 'react-native-vector-icons/FontAwesome';

import {Text, View, TextInput, StyleSheet} from 'react-native';
import {connectSearchBox} from 'react-instantsearch/connectors';

interface SearchBoxProps {
  clearFilter: () => void;
  currentRefinement: String;
  displaySuggestions: () => void;
  firstKeystroke: () => void;
  refine: () => void;
  isFirstKeystroke: Boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  currentRefinement,
  displaySuggestions,
  clearFilter,
  refine,
  isFirstKeystroke,
  firstKeystroke,
}) => {
  return (
    <View style={styles.searchBox}>
      <Text>
        <Icon name="search" size={20} color="#424242" />
      </Text>
      <TextInput
        style={styles.searchBox_input}
        value={currentRefinement}
        placeholder="Type in your address e.g. 15/29 Schutt St"
        placeholderTextColor="#424242"
        clearButtonMode="always"
        spellCheck={false}
        autoCorrect={false}
        autoCapitalize="none"
        onFocus={(arg) => displaySuggestions(arg)}
        onChangeText={(text) => {
          if (text === '') {
            displaySuggestions(false);
            clearFilter();
          } else {
            displaySuggestions(true);
          }

          refine(text);
        }}
        onChange={() => {
          if (isFirstKeystroke) {
            displaySuggestions();
            firstKeystroke();
          }
        }}
      />
    </View>
  );
};

// SearchBox.propTypes = {
//   currentRefinement: PropTypes.string,
//   displaySuggestions: PropTypes.func,
//   firstKeystroke: PropTypes.func,
//   refine: PropTypes.func,
//   isFirstKeystroke: PropTypes.bool,
//   clearFilter: PropTypes.func,
// };


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
  
export const ConnectedSearchBox = connectSearchBox(SearchBox);
