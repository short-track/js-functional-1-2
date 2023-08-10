// session 3 은 객체를 이터러블로 다룬다
const _ = require('fxjs/Strict')
const L = require('fxjs/Lazy')
// 1. values
// 일반적으로 object의 value만 뽑을 때 object.values를 이용한다
const obj1 = {
    a: 1,
    b: 2,
    c: 3,
    d: 4
};

console.log(Object.values(obj1))

// 지연 평가를 적용해본다. 이를 이용하면 take를 사용할 때
// 필요한 만큼만 순회를 한다

const lazyValues = function *(obj) {
    for (const key in obj) {
        yield obj[key]
    }
}

_.go(
    obj1,
    lazyValues,
    L.map(a => a + 10),
    L.take(2),
    _.reduce((a, b) => a + b),
    console.log);

// 2. entries를 만들어 본다
// 이것은 앞에 어떤 형태가 와도 이터러블 프로토콜로 구현되어 있다면
// 처리가 가능하다는 것을 보여준다
const lazyEntries = function *(obj) {
    for (const key in obj) {
        yield [key, obj[key]]
    }
}

_.go(
    obj1,
    lazyEntries,
    L.filter(([_, v]) => v % 2),
    L.map(([k, v]) => ({ [k]: v })),
    _.reduce(Object.assign),
    console.log);

// 3. keys
const lazyKeys = function *(obj) {
    for (const key in obj) {
        yield key;
    }
}

_.go(
    obj1,
    L.keys,
    _.each(console.log));
