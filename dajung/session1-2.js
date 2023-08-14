const { range } = require("fxjs");
const _ = require("fxjs/Strict");
const L = require("fxjs/Lazy");

// 이번에는 while의 효과를 낼 수 있는 range를 알아본다
// 이 메서드는 숫자로된 list값을 표현하기에 좋다
// 예를 들어 [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] 값을 표현해 본다
function f1(end) {
    let i = 0
    const result = []
    while (i < end) {
        result.push(i)
        ++i
    }
    return result
}
console.log(f1(10)) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// range(start, end, step)로 되어 있다 f1 내부를 다 제거하고 L.range를 이용한다
function f2(end) {
    return range(0, end, 1)
}
console.log(f2(10)) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// 마지막으로 each라는 메서드는 효과를 구분하는 메서드다
// 두 개의 인자를 받는데 재료로 사용하는 인자와 인자 각각에 부여할 효과에 해당하는 함수를 받는다.
// 예를 들어 _each(console.log, [1, 2, 3]) 은 1, 2, 3 각각 console.log를 적용한다는 의미다
function f3(end) {
    _.go(
        L.range(1, end, 2),
        _.each(console.log)
    )
}
f3(10) // 1, 3, 5, 7, 9  각각 한 줄씩으로 출력

// 별 그리기
const join = sep => _.reduce((a, b) => `${a}${sep}${b}`);

_.go(
    L.range(1, 6),
    L.map(L.range),
    L.map(L.map(_ => '*')),
    L.map(join('')),
    join('\n'),
    console.log);

// 구구단
_.go(
    L.range(2, 10),
    L.map(a => _.go(
      L.range(1, 10),
      L.map(b => `${a}x${b}=${a*b}`),
      join('\n')
    )),
    join('\n\n'),
    console.log);
