
//redux

import { combineReducers } from 'redux';
import counter from './counter';
import groupList from './groupList';
import serviceList from './serviceList';

const rootReducer = combineReducers({
  counter,
  groupList,
  serviceList
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;