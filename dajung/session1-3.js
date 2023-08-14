const _ = require('fxjs/Strict')
const L = require('fxjs/Lazy')

// reduce에 사용하는 인자가 하나의 타입으로 통일되면 편하다
const users = [
    { name: 'AA', age: 35 },
    { name: 'BB', age: 26 },
    { name: 'CC', age: 28 },
    { name: 'CC', age: 34 },
    { name: 'EE', age: 23 }
];

// 아래의 두 코드를 비교 했을 때 map을 사용한 코드가 더 좋다
// 왜냐하면 map을 사용해서 reduce에 들어가는 인자 타입을 통일 시켰기 때문이다
console.log(_.reduce((total, u) => total + u.age, 0, users))

console.log(_.reduce((a, b) => a + b, L.map(u => u.age, users)))

// 다른 말로 복잡한 하나의 함수를 사용하는 것 보다는 간단한 여러 개의 함수를
// 사용하는 것이 유리하다(가독성, 재사용성)
const add = (a, b) => a + b;
const ages = L.map(u => u.age);

console.log(_.reduce(add, ages(users)));

// reduce 하나 보다는 map + filter + reduce
// 30 살 이상의 사람들의 나이 합을 구하는 코드를 작성해본다
// reduce를 이용해서 아래와 같이 코드를 작성할 수 있지만
// 아래의 코드는 함수, 초기 값, 재료의 3개의 인자를 받기 때문에 복잡하다
console.log(
    _.reduce(
     (total, u) => u.age >= 30 ? total : total + u.age,
      0,
      users));

// 아래와 같이 여러 개의 단순한 함수로 쪼개면 읽기 편해진다
console.log(
_.reduce(add,
    L.map(u => u.age,
    L.filter(u => u.age < 30, users))));

// reduce 안에 object를 처리하는 코드를 바꿔본다
const obj1 = {
    a: 1,
    b: undefined,
    c: 'CC',
    d: 'DD'
};

// 먼저 하나의 절차형 코드를 작성한다
function query1(obj) {
    let acc = '';
    for (const k in obj) {
        const v = obj[k]

        if (v === undefined) continue
        if (acc === '') acc += '&'
        console.log(k + '=' + v)
        acc += k + '=' + v
    }
    return acc
}
console.log(query1(obj1))

// 그리고 함수형 reduce 메서드 하나를 이용하여 바꿔보면
// 함수형으로 작성하였지만 reduce에 있는 작업들이 많고
// 결정적으로 인자로 받는 값들이 많고 타입들이 달라서 복잡하다
function query2(obj) {
    return Object
      .entries(obj)
      .reduce((query, [k, v], i) => {
        if (v === undefined) return query;
        return `${query}${i > 0 ? '&' : ''}${k}=${v}`;
    }, '');
}
console.log(query2(obj1))


// reduce 안에 코드를 최대한 줄여주고 하나의 타입으로 통일한다.
const join = _.curry((sep, iter) =>
  _.reduce((a, b) => `${a}${sep}${b}`, iter));

const query3 = obj =>
  join('&',
    _.map(([k, v]) => `${k}=${v}`,

    //   _.reject(([_, v]) => v === undefined,
    // 개인적으로는 아래 코드를 더 선호해서 바꿨다
    _.filter(([_, v]) => v,
        Object.entries(obj))))
console.log(query3(obj1))

// 여기서 더 나아가서 중첩된 구조를 바꾸기 위해서 pipe를 이용한다
const query4 = _.pipe(
  Object.entries,
  L.reject(([_, v]) => v === undefined),
  L.map(([k, v]) => `${k}=${v}`),
  _.reduce((a, b) => `${a}&${b}`));

console.log(query4(obj1))
console.clear()

// 이번에는 queryString을 객체로 만드는 코드를 작성해본다
const split = _.curry((sep, str) => str.split(sep))
const queryToObject = _.pipe(
    split('&'),
    L.map(split('=')),
    L.map(([k, v]) => ({[k]:v})),
    _.reduce(Object.assign)
)
console.log(queryToObject('a=1&c=CC&d=DD'))

// 개인적으로 여기서 중요하게 생각하는 내용은 
// 함수를 작게 쪼개서 큰 작업을 여러 개의 작은 작업으로 처리하는 것이라고 생각한다
