const { filter, map, take, reduce } = require('fxjs')
const _ = require("fxjs/Strict");
const L = require("fxjs/Lazy");
// 함수형 메서드 가운데 절차적 프로그래밍 언어에서 사용하는
// 키워드(if, for, while, break 등등)와 비슷한 역할을 하는 메서드가 있다.
// 그러한 메서드로 아래의 절차적 코드를 함수형 코드로 바꿔본다
function f1(limit, list) {
    let acc = 0;
    for (const a of list) {
        if (a % 2) {
            const b = a * a;
            acc += b;
            if (--limit == 0) break;
        }
    }
    console.log(acc);
}
f1(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35

// 먼저 if 에 해당하는 filter가 있다
// 2로 나누어 떨어지는 값만 처리하므로 for 선언 부분에 2로 떨어지는 값만
// 넘겨주면 if를 제거할 수 있다
function f2(limit, list) {
    let acc = 0;
    for (const a of filter(a => a % 2, list)) {
        const b = a * a;
        acc += b;
        if (--limit == 0) break;
    }
    console.log(acc);
}
f2(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35

// 다음으로 map은 값을 할당하거나 변경하는 역할을 한다
// b에 값을 할당 하는 코드를 map으로 바꾸고 b에 할당하는 코드를 지운다
function f3(limit, list) {
    let acc = 0;
    for (const a of map(a => a * a, filter(a => a % 2, list))) {
        acc += a;
        if (--limit == 0) break;
    }
    console.log(acc);
}
f3(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35


// take는 break에 효과를 가지고 있다. 위의 코드에서 limit가 0이 될때까지
// for문이 반복되는데 바꿔말하면 limit 만큼의 갯수를 원하는 것과 비슷하다
// take를 추가하고 break가 있는 줄을 삭제한다
function f4(limit, list) {
    let acc = 0;
    for (const a of take(limit, map(a => a * a, filter(a => a % 2, list)))) {
        acc += a;
    }
    console.log(acc);
}
f4(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35


// reduce는 값을 축약하거나 합산하는 역할을 한다
// acc에 값을 누적하는 코드를 reduce로 대체하고 acc 변수와 for문을 제거한다
function f5(limit, list) {
    console.log(reduce((a, b) => a + b, take(limit, map(a => a * a, filter(a => a % 2, list)))));
}
f5(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35

// 위의 코드는 개인적으로 아쉬운 점이 코드가 중첩되어있다.
// 개인적으로 코드가 중첩되면 겹겹이 쌓여있는 느낌이 들어서 읽기 불편하다
// 개인적인 취향으로 한 줄씩 표현할 수 있는 코드로 합성을 해본다
function f6(limit, list) {
    _.go(
        list,
        filter(a => a % 2),
        map(a => a * a),
        take(limit),
        reduce((a, b) => a + b),
        console.log
    )
}
f6(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35

// 마지막으로 limit가 3이므로 매번 전체 list를 만들어서 함수를 적용할 필요가 없다.
// 즉 lazy로 바꿔서 계산하는게 더 효과적이다

function f7(limit, list) {
    _.go(
        list,
        L.filter(a => a % 2),
        L.map(a => a * a),
        L.take(limit),
        _.reduce((a, b) => a + b),
        console.log
    )
}
f7(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35