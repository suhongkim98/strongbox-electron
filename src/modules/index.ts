
//redux

import { combineReducers } from 'redux';
import counter from './counter';
import groupList from './groupList';
import serviceList from './serviceList';
import selectedService from './selectedService';
import accountList from './accountList';

const rootReducer = combineReducers({
  counter,
  groupList,
  serviceList,
  selectedService,
  accountList
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;