let sessionGeneration = 0;

/** 비동기 인증 응답이 현재 로그인 세션에 속하는지 확인할 세대 번호를 반환합니다. */
export function getSessionGeneration(): number {
  return sessionGeneration;
}

/** 로그인 상태가 바뀔 때 이전 세션의 늦은 응답을 무시하도록 세대 번호를 올립니다. */
export function advanceSessionGeneration(): number {
  sessionGeneration += 1;
  return sessionGeneration;
}
