
//redux

import { combineReducers } from 'redux';
import counter from './counter';
import groupList from './groupList';
import serviceList from './serviceList';
import selectedService from './selectedService';
import accountList from './accountList';
import userList from './userList';

const rootReducer = combineReducers({
  counter,
  groupList,
  serviceList,
  selectedService,
  accountList,
  userList
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;