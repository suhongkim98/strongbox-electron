//그룹 리스트 상태관리 redux
import { StrongboxDatabase } from "../StrongboxDatabase";
import { GroupType } from "./jsonInterface";


const UPDATE = 'groupList/UPDATE' as const;

export const updateGroup = (newList: any) => ({
  type: UPDATE,
  payload: newList
});
export const updateGroupAsync = () => (dispatch: any) => {
  const database = StrongboxDatabase.getInstance();
  
  database.getGroupList(global.idx).then((result: any)=>{
    dispatch(updateGroup(result.map((data:any)=>{
      const group: GroupType = {
          GRP_IDX: data.IDX, 
          GRP_NAME: data.GRP_NAME, 
          SORT_ORDER: data.SORT_ORDER
      };
      return group})));
      
  });
};
type groupListAction =
  | ReturnType<typeof updateGroup>;

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
      default:
        return state;
    }
  }
  
  export default groupList;