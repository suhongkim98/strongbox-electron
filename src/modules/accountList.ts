//계정리스트 상태관리 redux

const UPDATE = 'accountList/UPDATE' as const;
const ADD = 'accountList/ADD' as const;
const DELETE = 'accountList/DELETE' as const;

export const updateAccount = (newList: any) => ({
  type: UPDATE,
  payload: newList
});
export const addAccount = (item: any) => ({
  type: ADD,
  payload: item
});
export const deleteAccount = (item: any) => ({
  type: DELETE,
  payload: item
});

type accountListAction =
  | ReturnType<typeof updateAccount>
  | ReturnType<typeof addAccount>
  | ReturnType<typeof deleteAccount>;

  type accountListState = {
    list: any; 
  }
  
  const initialState: accountListState = {
    list: []
  };

  const accountList = (state: accountListState = initialState, action: accountListAction) => {
    switch (action.type) {
      case UPDATE:
        return { list: action.payload }; // 새로운 배열로 교체
      case ADD:
        return { list: [...state.list, action.payload]}; // 새로운 아이템 추가
        case DELETE:
          const newList = state.list.filter((row:any)=>{return row.ACCOUNT_IDX !== action.payload});
          return { list: newList};
      default:
        return state;
    }
  }
  
  export default accountList;