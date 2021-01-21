//그룹 리스트 상태관리 redux
import { StrongboxDatabase } from "../StrongboxDatabase";
import { ServiceType } from "./jsonInterface";

const UPDATE = 'serviceList/UPDATE' as const;

export const updateService = (newList: any) => ({
  type: UPDATE,
  payload: newList
});
export const updateServiceAsync = () => (dispatch: any) => {
  const database = StrongboxDatabase.getInstance();
  database.getServiceListByUserIDX(global.idx).then((result)=>{
    dispatch(updateService(result.map((data:any) => 
    {
        const service: ServiceType = {
            GRP_IDX: data.GRP_IDX,
            SORT_ORDER: data.SERVICE_ORDER,
            SERVICE_IDX: data.SERVICE_IDX, 
            SERVICE_NAME: data.SERVICE_NAME
        };
        return service})));
}).catch((error)=>{
    console.log(error);
});
};

type serviceListAction =
  | ReturnType<typeof updateService>;

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
      default:
        return state;
    }
  }
  
  export default serviceList;