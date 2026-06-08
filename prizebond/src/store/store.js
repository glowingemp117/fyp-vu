import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import userReducer from './slices/user';
import bondsReducer from './slices/bonds';
import drawsReducer from './slices/draws';
import marketplaceReducer from './slices/marketplace';

const rootReducer = combineReducers({
  user: userReducer,
  bonds: bondsReducer,
  draws: drawsReducer,
  marketplace: marketplaceReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'], // Only persist user state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const STORE = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const PERSISTOR = persistStore(STORE);
