const _ = require('fxjs/Strict')
const L = require('fxjs/Lazy')
// 안전한 함수 합성을 위해 map을 써보기
const f = x => x + 10;
const g = x => x - 5;
const fg = x => f(g(x));

// 아래의 코드는 빈 값이 들어가면 NaN을 반환한다
console.log(fg()) 

// 이를 방지하기 위해 map을 활용한다
_.go(
    [10],
    L.map(fg),
    _.each(console.log)
)

_.go(
    [],
    L.map(fg),
    _.each(console.log)
)

// 비슷하게 만약 BB라는 유저가 없다면 아래 콘솔은 undefined를 출력한다
// 그것을 막기 위해 if 문을 추가한다
const users = [
    { name: 'AA', age: 35 },
    // { name: 'BB', age: 26 },
    { name: 'CC', age: 28 },
    { name: 'CC', age: 34 },
    { name: 'EE', age: 23 }
  ];
  
const user = _.find(u => u.name == 'BB', users);
if (user) {
    console.log(user.age);
}

// L.filter를 통해 코드를 수정해본다
// 내 생각에 L.filter를 사용하는 이유는 배열을 반환하기 때문이고
// 고차 함수들은 빈 배열에 대한 처리(위의  map처럼)를 자동으로 하기때문이 아닐까 싶다
// BB라는 유저가 없기 때문에 출력을 하지 않는다
_.go(
    users,
    L.filter(u => u.name === 'BB'),
    L.map(u => u.age),
    L.take(1),
    _.each(console.log)
)