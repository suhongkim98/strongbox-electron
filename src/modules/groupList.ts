//그룹 리스트 상태관리 redux

const UPDATE = 'groupList/UPDATE' as const;

export const update = (newList: any) => ({
  type: UPDATE,
  payload: newList
});

type groupListAction =
  | ReturnType<typeof update>;

  type groupListState = {
    list: any; // JSON으로다가 받아 뿌리는 곳에서 컴포넌트 만들어 뿌리자
  }
  
  const initialState: groupListState = {
    list: []
  };

  const groupList = (state: groupListState = initialState, action: groupListAction) => {
    switch (action.type) {
      case UPDATE:
        return { list: action.payload }; // 새로운 JSON로 교체
      default:
        return state;
    }
  }
  
  export default groupList;