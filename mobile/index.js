/**
 * @format
 */

import { AppRegistry, Text, TextInput } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

Text.defaultProps = {
  ...Text.defaultProps,
  maxFontSizeMultiplier: 1.1,
};
TextInput.defaultProps = {
  ...TextInput.defaultProps,
  maxFontSizeMultiplier: 1.1,
};

AppRegistry.registerComponent(appName, () => App);
