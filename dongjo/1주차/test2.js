const users = [
    { name: 'AA', age: 35 },
    { name: 'BB', age: 26 },
    { name: 'CC', age: 28 },
    { name: 'CC', age: 34 },
    { name: 'EE', age: 23 }
];
  
// 처럼 reduce 로만 했을 때보다
console.log(_.reduce((total, u) => total + u.age, 0, users));
  

// 이렇게 함수의 조합을 통해
// 함수가 재사용 가능하고, 조합이 가능한 형태로 구현하는 것이 훨씬 좋다
const add = (a, b) => a + b;
const ages = L.map(u => u.age);

console.log(_.reduce(add, ages(users)));