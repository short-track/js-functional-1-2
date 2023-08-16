// 시간(시점)을 이터러블로 다루기

// range와 take의 재해석
// 즉시 평가와 지연 평가에 대한 다른 해석. 간단히 말하면 _.range, _.take와 L.range, L.take를 비교한 내용이다.
// 지연 평가는 당장 실행되지 않고 실행 시점을 지연시킬 수 있기 때문에
// 최대 n번 일어날 일이라고 해석할 수 있다
const _ = require('fxjs/Strict')
const L = require('fxjs/Lazy')

_.go(
    _.range(10),
    _.take(3),
    _.each(console.log)
)

_.go(
    L.range(10), // 앞으로 10번 일어날 일
    L.take(3), // 앞으로 3번 일어날 일
    _.each(console.log)
)

// 여기에 settimeout과 비슷한 _.delay를 사용해본다
// _.delay(time, time후에 계산될 값)
_.go(
    L.range(1, 10),
    L.map(_.delay(1000)),
    L.filter(a => a % 2),
    L.map(_ => new Date()),
    _.take(3),
    _.each(console.log));

// 이번 세션은 내용이 이해하기 어렵다. 시간에 대한 내용을
// 지연 평가에 접목시키다 보니 개인적인 경험, 시각으로 
// 설명을 하였고 결과적으로 내 입장에서는 난해한 이야기처럼 들린다

// 2. takeWhile, takeUntil

// takeWhile -> true인 값만 받는다.
_.go(
    [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0],
    L.takeWhile(a => a), // 8까지만 가져온다
    _.each(console.log));

// takeUntil -> 처음으로 true가 나오기 전까지 값을 담는다.
_.go(
    [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0],
    L.takeWhile(a => a), // 1
    _.each(console.log));


_.go(
    [0, false, undefined, null, 10, 20, 30],
    L.takeUntil(a => a), // 10까지 값을 담는다
    _.each(console.log));

console.clear()
// 실습(할 일들을 이터러블로) cars 길이가 4인 것만 추출
const track = [
    { cars: ['철수', '영희', '철희', '영수'] },
    { cars: ['하든', '커리', '듀란트', '탐슨'] },
    { cars: ['폴', '어빙', '릴라드', '맥컬럼'] },
    { cars: ['스파이더맨', '아이언맨'] },
    { cars: [] }
];

_.go(
    L.range(Infinity), // 언제 끝날지는 모르지만 연속적으로
    L.map(i => track[i]),
    L.map(({cars}) => cars),
    L.map(_.delay(2000)),
    L.takeWhile(({length: l}) => l == 4),
    // L.takeUntil(({length: l}) => l < 4),
    L.flat,
    L.map(car => `${car} 출발!`),
    _.each(console.log)
)

