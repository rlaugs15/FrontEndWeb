import { useState } from "react";
//서버에 데이터를 POST 요청으로 보낼 때 사용하는 훅
interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}

//useMutation의 리턴타입
type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];

//제네릭 타입으로 해당 훅을 사용하는 개발자에게 받을 것 같은 응답의 타입을 보내줌
export default function useMutation<T = any>(
  url: string
): UseMutationResult<T> {
  const [state, setSate] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });
  function mutation(data: any) {
    setSate((prev) => ({ ...prev, loading: true }));
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json().catch(() => {})) //catch로 에러무시, api가 data 받지 않아도 에러 안뜸
      .then((data) => setSate((prev) => ({ ...prev, data })))
      .catch((error) => setSate((prev) => ({ ...prev, error })))
      .finally(() => setSate((prev) => ({ ...prev, loading: false })));
  }
  //사용자는 배열의 두 번째 요소로 받은 상태 객체{...state}를 마음대로 변경해도 내부적으로 사용되는 state에는 영향을 미치지 않음
  //다양한 곳에서 훅으로 사용하기 위해 디폴드 값들을 유지
  return [mutation, { ...state }];
}
