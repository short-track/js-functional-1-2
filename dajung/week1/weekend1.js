// 입력값
const 근태관리 = [
    { name: 'joy', age: 20, history: [
        { day: '2021-01-01', checkin: true },
        { day: '2021-01-02', checkin: true },
        { day: '2021-01-03', checkin: true },
        { day: '2021-01-04', checkin: false },
        { day: '2021-01-05', checkin: false },
        { day: '2021-01-06', checkin: true },
        { day: '2021-01-07', checkin: true },
    ]},
    { name: 'aron', age: 30, history: [
        { day: '2021-01-01', checkin: true },
        { day: '2021-01-02', checkin: false },
        { day: '2021-01-03', checkin: true },
        { day: '2021-01-04', checkin: true },
        { day: '2021-01-05', checkin: false },
        { day: '2021-01-06', checkin: false },
        { day: '2021-01-07', checkin: true },
    ]},
    { name: 'paul', age: 24, history: [
        { day: '2021-01-01', checkin: true },
        { day: '2021-01-02', checkin: false },
        { day: '2021-01-03', checkin: true },
        { day: '2021-01-04', checkin: false },
        { day: '2021-01-05', checkin: true },
        { day: '2021-01-06', checkin: true },
        { day: '2021-01-07', checkin: false },
    ]},
]

const _ = require('fxjs/Strict')
// console.log(_.go(
//     근태관리,
//     _.map(근태 => {
//         const count = 근태.history.reduce((acc, b) => {
//             if (b.checkin) acc += 1
//             return acc
//         } , 0)
//         근태.count = count
//         return 근태
//     },
//     _.map(근태 => {
        
//     })
// ))

// 사용법

const groupBy = function(iter, f) {
    _.go(
    iter,
    _.map(word => [f(word), word]),
    _.map(word => [String(word[0]), word[1]]),
    _.reduce((acc, word) => {
        if (Object.hasOwn(acc, word[0])) {
            acc[word[0]] = [word[1]]
        } else {
            acc[word[0]] = [...acc[word[0]], word[1]]
        }
        console.log(word)
    }, {}, iter)
    // _.reduce((acc, word) => {
        // if (Object.hasOwn(acc, word[0])) {
        //     acc[word[0]] = [word[1]]
        // } else {
        //     acc[word[0]] = [...acc[word[0]], word[1]]
        // }
    //     return acc
    // }, {})
    )
}


console.log(groupBy(['one', 'two', 'three'], s => s.length))
// 결과값
// => { '3': ['one', 'two'], '5': ['three'] }
