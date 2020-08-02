import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import error from 'src/redux/error';

const reducer = combineReducers({
  error
});

export const store = configureStore({
  reducer
});

export type AppState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
