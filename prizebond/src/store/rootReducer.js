import { combineReducers } from '@reduxjs/toolkit';
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

export default rootReducer;
