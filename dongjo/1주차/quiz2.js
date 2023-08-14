import { go, reduce, map, } from '../common.js'

const datas = ['one', 'two', 'three']

const groupBy = (arr, f) => go(
    arr,
    map(a => [f(a), a]),
    (iter) => reduce((group, [k, v]) => {
        group[k] = group[k] ? [...group[k], v] : [v]
        return group
    }, {}, iter),
)

console.log(groupBy(datas, a => a.length))