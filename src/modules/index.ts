
//redux

import { combineReducers } from 'redux';
import counter from './counter';
import groupList from './groupList';
import serviceList from './serviceList';
import selectedService from './selectedService';

const rootReducer = combineReducers({
  counter,
  groupList,
  serviceList,
  selectedService
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;