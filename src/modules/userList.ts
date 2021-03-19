import { StrongboxDatabase } from "../StrongboxDatabase";

const UPDATE = 'userList/UPDATE' as const;

export const updateUser = (newList: any) => ({
  type: UPDATE,
  payload: newList,
});
// getState를 쓰지 않는다면 굳이 파라미터로 받아올 필요 없습니다.
/* redux-thunk로 redux 동기처리 하기 */
export const updateUserAsync = () => (dispatch: any) => {
  const database = StrongboxDatabase.getInstance();
  database.select('IDX,NAME','USERS_TB').then((result: any)=>{
      dispatch(updateUser(result));
}).catch((error)=>{
   console.log(error);
});
};
type userListAction = ReturnType<typeof updateUser>;

type userListState = {
  list: any;
};

const initialState: userListState = {
  list: [],
};

const userList = (
  state: userListState = initialState,
  action: userListAction,
) => {
  switch (action.type) {
    case UPDATE:
      return {list: action.payload}; // 새로운 배열로 교체
    default:
      return state;
  }
};

export default userList;