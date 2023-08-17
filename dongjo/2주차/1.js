import { go, filter, reduce } from "fxjs";
import * as L from "fxjs/Lazy";
// import * as C from "fxjs/Concurrency";

/*
  1. 이미 이터러블로 다룰 수 있는 객체들
  Mat, Set, DOM, Arguments, NodeList, HTMLCollection, 유사배열객체 들을 기본적으로 이터러블로 다룰 수 있다.
*/


const m = new Map();
m.set('a', 1);
m.set('b', 2);
m.set('c', 3);

go(
  m,
  filter(([k, v]) => v % 2),
  entries => new Map(entries),
  console.log);


const s = new Set();
s.add(10);
s.add(20);
s.add(30);

const add = (a, b) => a + b;
console.log(reduce(add, s));

/*
  2. 이터러블 프로토콜을 적용시켜야하는 커스텀 이터러블
  아래와 같이 *[Symbol.iterator]() 를 정의해주면 된다.
*/

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
  // 이 코드가 핵심 generator 함수를 정의해주면 된다.
  *[Symbol.iterator]() {
    yield *this._models;
  }
}
class Product extends Model {}
class Products extends Collection {
  plus = (a, b) => a + b
  addAll = reduce(this.plus)

  getPrices() {
    return L.map(p => p.get('price'), this);
  }
  totalPrice() {
    return this.addAll(this.getPrices());
  }
}

const coll = new Collection();
coll.add(new Model({ id: 1, name: 'AA' }));
coll.add(new Model({ id: 3, name: 'BB' }));
coll.add(new Model({ id: 5, name: 'CC' }));

const products = new Products();
products.add(new Product({ id: 1, price: 10000 }));
products.add(new Product({ id: 3, price: 25000 }));

console.log( products.totalPrice() );

// 아래 초창기 코드와는 확실히 비교된다.
const genObj = (obj) => {
  return {
      ...obj,
      [Symbol.iterator]() {
          const keys = Object.keys(this);
          const values = Object.values(this);
          let size = keys.length - 1;
          return {
              next() {
                  if (size < 0) {
                      return {done: true};
                  }
                  const idx = size;
                  const res = {value: { [keys[idx]]: values[idx] }, done: false};
                  size--;
                  return res;
              },
              [Symbol.iterator]() {
                  return this;
              }
          }
      }
}};

