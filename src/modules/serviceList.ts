//그룹 리스트 상태관리 redux

const UPDATE = 'serviceList/UPDATE' as const;
const ADD = 'serviceList/ADD' as const;

export const updateService = (newList: any) => ({
  type: UPDATE,
  payload: newList
});
export const addService = (item: any) => ({
  type: ADD,
  payload: item
});

type serviceListAction =
  | ReturnType<typeof updateService>
  | ReturnType<typeof addService>;

  type serviceListState = {
    list: any; 
  }
  
  const initialState: serviceListState = {
    list: []
  };

  const serviceList = (state: serviceListState = initialState, action: serviceListAction) => {
    switch (action.type) {
      case UPDATE:
        return { list: action.payload }; // 새로운 배열로 교체
      case ADD:
        return { list: [...state.list, action.payload]}; // 새로운 아이템 추가
      default:
        return state;
    }
  }
  
  export default serviceList;