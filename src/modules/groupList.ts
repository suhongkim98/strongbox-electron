//그룹 리스트 상태관리 redux

const UPDATE = 'groupList/UPDATE' as const;
const ADD = 'groupList/ADD' as const;
const DELETE = 'groupList/DELETE' as const;

export const updateGroup = (newList: any) => ({
  type: UPDATE,
  payload: newList
});
export const addGroup = (item: any) => ({
  type: ADD,
  payload: item
});
export const deleteGroup = (groupIDX: number) => ({
  type: DELETE,
  payload: groupIDX
});

type groupListAction =
  | ReturnType<typeof updateGroup>
  | ReturnType<typeof addGroup>
  | ReturnType<typeof deleteGroup>;

  type groupListState = {
    list: any; // 
  }
  
  const initialState: groupListState = {
    list: []
  };

  const groupList = (state: groupListState = initialState, action: groupListAction) => {
    switch (action.type) {
      case UPDATE:
        return { list: action.payload }; // 새로운 배열로 교체
      case ADD:
        return { list: [...state.list, action.payload]}; // 새로운 아이템 추가
      case DELETE:
        const newList = state.list.filter((row:any)=>{return row.GRP_IDX !== action.payload});
        return { list: newList }; // 해당 IDX 삭제
      default:
        return state;
    }
  }
  
  export default groupList;