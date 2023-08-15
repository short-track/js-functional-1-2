// 사용자 정의 객체를 이터러블로 다루기
// map, set
const _ = require('fxjs/Strict')
const L = require('fxjs/Lazy')


let m = new Map();
m.set('a', 1);
m.set('b', 2);
m.set('c', 3);

_.go(
    m,
    _.filter(([k, v]) => v % 2 === 0),
    _.takeAll,
    entries => new Map(entries),
    console.log
)

let s = new Set()
s.add(10)
s.add(20)
s.add(30)

const add = (a, b) => a + b

console.log(_.reduce(add, s))

// 인상 깊었던 내용은
// 여기서 이터러블을 이용한 함수형 프로그래밍은 특정 패러다임을 대체하는 것이 아니라
// 언어에서 지원하는 if, for등의 문법을 함수형으로 대체하는 것이다.
// 그렇기 때문에 객체지향으로 추상화 및 설계를 하고
// 내부 구현을 함수형으로 코드를 작성하는 것이 가능하다.

// model, collection
class Model {
    constructor(attrs = {}) {
      this._attrs = attrs;
    }
    get(k) {
      return this._attrs[k];
    }
    set(k, v) {
      this._attrs[k] = v;
      return this;
    }
}

// class Collection {
//     constructor(models = []) {
//       this._models = models;
//     }
//     at(idx) {
//       return this._models[idx];
//     }
//     add(model) {
//       this._models.push(model);
//       return this;
//     }
// }

// const coll = new Collection();
// coll.add(new Model({ id: 1, name: 'AA' }));
// coll.add(new Model({ id: 3, name: 'BB' }));
// coll.add(new Model({ id: 5, name: 'CC' }));

// console.log(coll.at(2).get('name'));
// console.log(coll.at(1).get('id'));

// 이렇게 코드를 구현한 상황에서는 coll 자체로 순회를 하기에는 불편하다(구체적으로 이터레이터를 반환하지 않으면)

// _.go(
//     // coll 자체로 할 수는 없고 range 를 이용해서 순회를 한다
//     L.range(3),
//     L.map(i => coll.at(i)),
//     L.map(m => m.get('name')),
//     _.each(console.log)
// )

// 해결책은 collection 클래스에 iterator를 반환하는 함수를 추가한다

class Collection {
    constructor(models = []) {
      this._models = models;
    }
    at(idx) {
      return this._models[idx];
    }
    add(model) {
      this._models.push(model);
      return this;
    }

    *[Symbol.iterator]() {
        for (const model of this._models) {
            yield model;
        }
    }
}

const coll = new Collection();
coll.add(new Model({ id: 1, name: 'AA' }));
coll.add(new Model({ id: 3, name: 'BB' }));
coll.add(new Model({ id: 5, name: 'CC' }));

_.go(
    coll,
    L.map(m => m.get('name')),
    _.each(console.log)
)

// product, products

class Product extends Model {}
class Products extends Collection {
    // totalPrice() {
    //     return this._models.reduce((acc, product) => {
    //         return acc + product.get('price')
    //     }, 0)
    // }
    totalPrice() {
        return _.go(
            this,
            L.map(product => product.get('price')),
            _.reduce((a, b) => a + b)
        )
    }
}

const products = new Products();
products.add(new Product({id: 1, price: 10000}))
console.log(products.totalPrice())
products.add(new Product({id: 3, price: 25000}))
console.log(products.totalPrice())
products.add(new Product({id: 5, price: 35000}))
console.log(products.totalPrice())
