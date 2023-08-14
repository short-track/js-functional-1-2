import _ from "lodash-es"

const users = [
    { name: "John", age: 25 },
    { name: "Lenny", age: 51 },
    { name: "Andrew", age: 43 },
    { name: "Peter", age: 81 },
];

function* gen() {
    yield 1;
    yield 2;
    yield 3;
}

const result = _.chain(users)
                .filter((user) => user.age < 60)
                .map((user) => `${user.name} is ${user.age}`)
                .value();

console.log(result)

const result2 = _(...gen())
                .filter((n) => n < 3)
                .value();

console.log(...gen())
console.log(result2)