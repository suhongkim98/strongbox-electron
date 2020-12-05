//그룹 리스트 상태관리 redux

const UPDATE = 'serviceList/UPDATE' as const;
const ADD = 'serviceList/ADD' as const;
const DELETE = 'serviceList/DELETE' as const;

export const updateService = (newList: any) => ({
  type: UPDATE,
  payload: newList
});
export const addService = (item: any) => ({
  type: ADD,
  payload: item
});
export const deleteService = (item: any) => ({
  type: DELETE,
  payload: item
});

type serviceListAction =
  | ReturnType<typeof updateService>
  | ReturnType<typeof addService>
  | ReturnType<typeof deleteService>;

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
        case DELETE:
          const newList = state.list.filter((row:any)=>{return row.SERVICE_IDX !== action.payload});
          return { list: newList};
      default:
        return state;
    }
  }
  
  export default serviceList;