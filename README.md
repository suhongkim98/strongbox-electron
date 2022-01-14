## Accong Box 크로스플랫폼 계정 관리 애플리케이션
![image](https://user-images.githubusercontent.com/35598710/149459547-b9fea366-e34c-4a78-bc13-6a379d3b6293.png)
                                                                                                                                         
### 프로젝트 기간 

2020.08. ~ 2021.02.

### Github Link

[Accong Box 계정 동기화 서버 Link](https://github.com/suhongkim98/strongbox-sync-server)<br>
[Accong Box 크로스플랫폼 React Native 모바일 애플리케이션 Link](https://github.com/suhongkim98/StrongboxReactNative)<br>
[Accong Box 크로스플랫폼 Electron 데스크톱 애플리케이션 Link](https://github.com/suhongkim98/strongbox-electron)<br>
[Accong Box HAProxy 설정파일 Link](https://github.com/suhongkim98/accongbox-haproxy)<br>
[Accong Box React 홍보 웹사이트 Link](https://github.com/suhongkim98/strongbox-front-end)<br>


### 상세내용

`Spring framework`와 `React`와 관련한 기술 숙련도를 높이고자 혼자 진행하였던 저의 첫 프로젝트 입니다.<br>
클라이언트 기기간 동기화 기능을 제공하여 모바일에서 기록한 계정 정보를 안전하게 데스크톱 앱에 동기화 시킬 수 있습니다.

### 성과

21-1 소프트웨어응용학부 학술제에서 최우수상을 수상하였습니다.
플레이스토어에 애플리케이션을 배포하였습니다. 

사이트를 통해 데스크톱 앱 다운로드가 가능합니다.
Link:  https://accongbox.com

### 사용 기술 및 라이브러리
- `Spring framework`
- `React`
- `Electron Framework`
- `React Native`
- `Docker`
- `websocket`, `STOMP`
- `HAProxy`
- `redis`

### 깨달은 점

- 저의 첫 포트폴리오용 Spring 프로젝트로 **Spring Framework**를 깊게 이해하는데 많은 도움이 되었습니다.
- 저의 첫 포트폴리오용 React 프로젝트로 **반응형 웹 제작**, **비동기 처리 방법**, redux 등 React를 깊게 이해하는데 많은 도움이 되었습니다.
- **Reverse Proxy**란 무엇인지 이해하게 되었습니다.
- **Docker**를 이용해 서비스를 배포해보며 Docker 기술을 습득하게 되었습니다.
- **Load Balancing**이 무엇인지 알게 되었고 **Roundrobin** 방식으로 **HAProxy**를 이용해 직접 구현해보았습니다.
- **무중단 배포**란 무엇인지 알게 되었고 서비스 장애에 대해 깊게 생각해보며 인프라 개발에 관심을 가지기 시작했습니다.
- **STOMP pub / sub**을 이용한 **websocket** 통신을 구현하며 양방향 통신을 이해하였습니다.
- **redis pub / sub** 을 활용해보며 Message Queue와는 차이점이 있음을 알게 되었습니다.
- **rainbow table attack**과 이를 막기 위해 고민해보며 **salt**를 이해하고 AES 키를 해시할 때 적용해보았습니다.
- **Json Web Token**을 이용한 인증, 인가를 구현해보며 JWT 토큰을 응용해보았습니다.
- **Certbot** 활용한 **와일드카드 SSL 인증서** 발급 및 **Reverse Proxy** 서버에 적용해보았습니다.
- **styled-components**와 첫 반응형 웹 페이지 제작해보았습니다.
- **Promise 객체**와 Javascript 비동기 처리 방법을 이해하였습니다.
- **react-thunk**를 활용한 redux에서 **미들웨어**를 활용한 비동기 처리 방법을 이해하였습니다.
- **Firebase**를 활용한 애플리케이션에 광고 연동하는 방법을 알게 되었습니다.
- 데스크톱 앱을 시중에 배포하는 것도 돈이 많이 드는구나 깨달았습니다.
- 처음으로 **도메인을** 구매하여 서브도메인을 나누어 프론트엔드, 백엔드로 라우팅하였습니다.
