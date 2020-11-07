//서비스선택 상태관리 redux

const UPDATE = 'selectedService/UPDATE' as const;

export const updateSelectedItemIndex = (newItemIndex: {idx:number,name:string}) => ({
  type: UPDATE,
  payload: newItemIndex
});

type selectedServiceAction =
  | ReturnType<typeof updateSelectedItemIndex>;

  type selectedServiceState = {
    itemIndex: {idx:number,name:string}; // 
  }
  
  const initialState: selectedServiceState = {
    itemIndex: {idx:-1,name:"no-name"}
  };

  const selectedService = (state: selectedServiceState = initialState, action: selectedServiceAction) => {
    switch (action.type) {
      case UPDATE:
        return { itemIndex: action.payload }; // 새로운 아이템 인덱스로 교체
      default:
        return state;
    }
  }
  
  export default selectedService;