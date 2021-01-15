//계정리스트 상태관리 redux

import { AES, enc } from "crypto-js";
import { StrongboxDatabase } from "../StrongboxDatabase";

const UPDATE = 'accountList/UPDATE' as const;

export const updateAccount = (newList: any) => ({
  type: UPDATE,
  payload: newList,
});
// getState를 쓰지 않는다면 굳이 파라미터로 받아올 필요 없습니다.
/* redux-thunk로 redux 동기처리 하기 */
export const updateAccountAsync = (serviceIdx: number) => (dispatch: any) => {
  const database = StrongboxDatabase.getInstance();
  database
    .getAccount(serviceIdx)
    .then((result) => {
      for (let i = 0; i < result.length; i++) {
        //복호화
        const decrypted = (AES.decrypt(result[i].PASSWORD, global.key)).toString(enc.Utf8);
        result[i].PASSWORD = decrypted;
      }
      //result반환
      dispatch(updateAccount(result));
    })
    .catch((error) => {
      console.log(error);
    });
};
type accountListAction = ReturnType<typeof updateAccount>;

type accountListState = {
  list: any;
};

const initialState: accountListState = {
  list: [],
};

const accountList = (
  state: accountListState = initialState,
  action: accountListAction,
) => {
  switch (action.type) {
    case UPDATE:
      return {list: action.payload}; // 새로운 배열로 교체
    default:
      return state;
  }
};

export default accountList;