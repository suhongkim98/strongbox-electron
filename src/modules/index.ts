
//redux

import { combineReducers } from 'redux';
import counter from './counter';
import groupList from './groupList';

const rootReducer = combineReducers({
  counter,
  groupList
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;