import { useEffect, useRef } from 'react';

export const useInterval = (callback:any, delay:any) => {
  // setInterval 안에 setState로 카운트 다운을 하면 문제가 생긴다.  https://velog.io/@jakeseo_me/번역-리액트-훅스-컴포넌트에서-setInterval-사용-시의-문제점#show-me-the-code
  // 변화된 값을 가져오지 못하는 현상
  // 커스텀 훅으로 해결하자
  const savedCallback: any = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}