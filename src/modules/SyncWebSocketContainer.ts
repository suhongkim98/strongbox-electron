import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient :Stomp.Client;

export const stompConnect = (onResponseMessage: (response: any) => any) => {
    return new Promise((succ, fail) => {
        const sockJS = new SockJS("http://localhost:8080/socket");
    stompClient = Stomp.over(sockJS);

    const headers = {
        'token': global.syncInfo.token, 
    };

    stompClient.connect(headers, function(frame) {  // 토큰 집어넣고
		console.log('connected: ' + frame);
		stompSubscribe('/topic/' + global.syncInfo.roomId, onResponseMessage); // 해당 방으로 구독
        succ(true);
	}, function(error){
        fail(error);
	});
    });
}

export const stompSubscribe = (path: string, onResponseMessage: (response: any) => any) => {
    const headers = {
        'token': global.syncInfo.token, 
    };

    stompClient.subscribe(path, function(response) {
        //전달받은 메시지
		console.log('응답: ' + response);
        //const message = JSON.parse(response.body);
        onResponseMessage(response);
	},headers); 
}

export const stompDisconnect = () => {
    if (stompClient.connected) {
        stompClient.disconnect(()=>{});
    }
}

export const stompSendMessage = (type: string, message: string) => {
    //syncPub으로 해당 메시지를 publish 요청한다.
    const body = {
        type: type,
        roomId: global.syncInfo.roomId, //서버에서는 토큰 안에 있는 룸아이디랑 이 룸아이디랑 일치하는지 검사해야한다.
        senderToken: global.syncInfo.token,
        message: message,
    };
	stompClient.send("/app/syncPub",{'token': global.syncInfo.token}, JSON.stringify(body)); 
}