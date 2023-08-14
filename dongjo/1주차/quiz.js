import { go, reduce, map, filter, } from '../common.js'

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

// map

const object = entries =>
  reduce((obj, [k, v]) => (obj[k] = v, obj), {}, entries);

go(
    근태관리,
    map(user => ({
        name: user.name,
        count: go(
            user.history,
            filter(({ checkin }) => !checkin),
            iter => reduce((sum) =>  sum + 1, 0, iter),
        ),
        })
    ),
    map(({ name, count }) => ([ name, count ])),
    object,
    console.log
);