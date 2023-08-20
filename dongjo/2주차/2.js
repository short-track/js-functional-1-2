import { go, delay, each } from "fxjs";
import * as L from "fxjs/Lazy";

// takeWhile 은 조건이 참인 동안만 값을 꺼내는 함수
// 지연평가이기 때문에 8까지만 실행된다.
go(
  [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0],
  L.takeWhile(a => a),
  each(console.log));


// takeUtil 최초로 참을 만나는 순간까지 값을 꺼내는 함수
// 지연평가이기 때문에 1까지만 실행됩니다.
go(
  [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0],
  L.takeUntil(a => a),
  each(console.log));

  /*
    시간을 이터러블로 다룬다는 것은 delay() 와 함수 조합을 통해, 시간을 다룰 수 있다는 것을 의미한다.
    delay() 조합을 통해서 타이밍을 다룰 수 있는게 특별한 것이 아니라
    지연 평가와 delay() 조합을 통해 시간을 다룰 수 있다는 것이 특별한 것이다.
  */

const track = [
  { cars: ['철수', '영희', '철희', '영수'] },
  { cars: ['하든', '커리', '듀란트', '탐슨'] },
  { cars: ['폴', '어빙', '릴라드', '맥컬럼'] },
  { cars: ['스파이더맨', '아이언맨'] },
  { cars: [] }
];

// L.map(delay(2000)) 는 2초마다 값을 꺼낸다는 의미인데, 지연평가 이다보니 2초 후 값을 꺼내고 지연된다.
// 그 다음 아래에 있는 평가! each 를 만나면 그동안 지연됐던 평가들이 모두 평가가 되고 그 다음으로 넘어간다.
// 바로 이런 부분을 이터러블로 다룬다고 말하고 있다.
go(
  L.range(Infinity),
  L.map(i => track[i]),
  L.map(({cars}) => cars),
  L.map(delay(2000)),
  L.takeWhile(({length: l}) => l == 4),
  // L.takeUntil(({length: l}) => l < 4),
  L.flat,
  // L.map(car => `${car} 출발!`),
  each(console.log));


const job = () => {
  console.log("work start");
}
// 5초에 한 번만 한다.
// 그런데 만일 job 5초보다 더 걸리면, job이 끝날 때까지
// Promise.all 은 기다려야 하기 때문에 5초보다 더 걸릴 수 있다.
(function recur() {
  Promise.all([
    delay(5000, undefined),
    job()
  ]).then(recur);
}) ();