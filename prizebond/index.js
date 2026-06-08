/**
 * @format
 */
import { AppRegistry, Text } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { STORE, PERSISTOR } from './src/store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

if (Text.defaultProps) {
  Text.defaultProps.allowFontScaling = false;
} else {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

export default function Main() {
  return (
    <GestureHandlerRootView>
      <Provider store={STORE}>
        <PersistGate loading={null} persistor={PERSISTOR}>
          <App />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent(appName, () => Main);
