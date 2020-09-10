import React, { useEffect, useState } from 'react';
import { StrongboxDatabase } from '../StrongboxDatabase';


const UserSelect:React.FC = () =>{
    const [userList, setUserList] = useState([]);
    
    useEffect(()=>{
    ///////////////DB TEST///////////////////
    const database = StrongboxDatabase.getInstance();
    //받아오는 예시
    database.testSelect().then((result:any)=>{
        console.log(result);
        const list =result.map((data:any)=>{return <div key={data.IDX}>{data.NAME} 과 {data.PASSWORD}</div>});
        setUserList(list);
        
    }).catch((error)=>{
        console.log(error);
    });
      
    /////////////////////////////////////
    },[]);//빈 배열을 넣어 재실행 될 필요가 읍다는걸 알림


    console.log(userList);
    return <div>{userList}</div>;
}

export default UserSelect;