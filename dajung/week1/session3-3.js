// 7. pick 인자로 넘겨준 속성 값만 추출한다
const _ = require('fxjs/Strict')
const L = require('fxjs/Lazy')
object = entries => _.reduce((obj, [k, v]) => (obj[k] = v, obj), {}, entries)

const obj2 = {
    a : 1,
    b : 2,
    c : 3,
    d : 4,
    e : 5
}

// ['b', 'c']
let pick = (keys, obj) => _.go(
    keys,
    _.map(key => [key, obj[key]]),
    object
)

console.log(pick(['b', 'c'], obj2)) // { b: 2, c: 3 }

// 만약 값이 undefined일 때는 제외
pick = (keys, obj) => _.go(
    keys,
    L.map(key => [key, obj[key]]),
    L.reject(([k, v]) => v === undefined),
    object
)

console.log(pick(['b', 'c', 'z'], obj2)) // { b: 2, c: 3 }

// 8. indexBy
// 특정 값을 key로 설정한 객체를 반환한다 
const users = [
    { id: 5, name: 'AA', age: 35 },
    { id: 10, name: 'BB', age: 26 },
    { id: 19, name: 'CC', age: 28 },
    { id: 23, name: 'CC', age: 34 },
    { id: 24, name: 'EE', age: 23 }
];

const indexBy = function(f, iter) {
    return _.reduce((obj, a) => (obj[f(a)] = a, obj), {}, iter)
}

console.log(indexBy(u => u.id, users))

// 9. indexBy 된 값을 filter 하기
const indexByFilter = () => _.go(
    indexBy(u => u.id, users),
    L.entries,
    L.filter(([_, {age}]) => age < 30),
    L.take(2),
    object
)

console.log(indexByFilter())
