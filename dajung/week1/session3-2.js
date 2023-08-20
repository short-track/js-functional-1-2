// 어떠한 값이든 이터러블로 다루기
// 모든 값을 이터러블로 다룰 수 있는 이유는 제네레이터 덕분이다.
// 왜냐하면 제네레이터는 코드로 순회를 통제할 수 있기 때문이다.
// 예를 들어 for 문은 반복하는 것 말고는 통제를 할 수 없다
const _ = require('fxjs/Strict')
const L = require('fxjs/Lazy')
const numbers = [1, 2, 3, 4]

// number값은 무조건 1, 2, 3, 4 가운데 하나이다
for (const number of numbers) {
    console.log(number)
}

// 그러나 generator는 이 값들을 통제할 수 있다
const g1 = function *(stop) {
    let i = -1;
    while (++i < stop) {
        yield 10;
        if (false) yield 20 + 30;
        yield 30;
    }
};
  
console.log([...L.take(3, g1(10))]);

// 그리고 이터러블로 다룰 수 있다
_.go(
    g1(10),
    L.take(2),
    _.reduce((a, b) => a + b),
    console.log);

// 5. Object
// 이 메서드는 이름 그대로 자바스크립트 객체를 만든다.
const a = [['a', 1], ['b', 2], ['c', 3]];
const b = {a: 1, b: 2, c: 3};

// 입력을 entries로 받는다는 가정하에 구현
let object = entries => _.go(
  entries,
  L.map(([k, v]) => ({ [k]: v })),
  _.reduce(Object.assign));
console.log(object(a)) // { a: 1, b: 2, c: 3 }

// 다음은 reduce하나로 만들어본다. 입력은 entries라고 가정한다
object = entries => _.reduce((obj, [k, v]) => (obj[k] = v, obj), {}, entries)

// 자바스크립트에서 제공하는 Map이라는 자료구조는 내부적으로 이터러블 프로토콜을 사용한다
let m = new Map()
m.set('a', 10);
m.set('b', 20);
m.set('c', 30);

console.log([...m[Symbol.iterator]()]) // [ [ 'a', 10 ], [ 'b', 20 ], [ 'c', 30 ] ]

// 그렇기 때문에 위에서 만든 object 메서드가 사용 가능하다
console.log(object(m)) // { a: 10, b: 20, c: 30 }

// 6. mapObject
// map + object를 합한 메서드이다
// 여기서 중요한 점은 절대 한번에 하지 말고
// 한 단계씩 분리해서 구현하는 것이다.

// 1. value에 map을 적용해야하기 때문에 k, v로 분리를 해야한다
// 2. 분리한 v에 map을 적용한다
// 3. 각각의 entry를 객체로 변환한다
// 4. 하나의 object로 합친다
const mapObject = (fn, obj) => _.go(
    obj,
    L.entries,
    L.map(([k, v]) => [k, fn(v)]),
    object
)

console.log(mapObject(x => x + 10, { a: 10, b: 20, c: 30}))
