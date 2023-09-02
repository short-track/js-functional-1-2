import { go, delay, each, reduce } from "fxjs";
import * as L from "fxjs/Lazy";

let users = [
	{ name: 'A', phone: '010-0000-0000', kakaoToken: 'adfjladfjdafs', age: 25, gender: '남성', isSuccess: null },
	{ name: 'B', phone: '010-0000-0000', kakaoToken: 'adfjladfjdafs', age: 30, gender: '남성', isSuccess: null },
	{ name: 'C', phone: '010-0000-0000', kakaoToken: 'adfjladfjdafs', age: 34, gender: '여성', isSuccess: null },
	{ name: 'D', phone: '010-0000-0000', kakaoToken: 'adfjladfjdafs', age: 24, gender: '여성', isSuccess: null },
	{ name: 'E', phone: '010-0000-0000', kakaoToken: 'adfjladfjdafs', age: 22, gender: '여성', isSuccess: null },
  { name: 'F', phone: '010-0000-0000', kakaoToken: 'adfjladfjdafs', age: 19, gender: '남성', isSuccess: null }
]

const sendPushMsg = (msg, token) => {
	//return fetch('https://xxxx.com/api', params);
  return delay(1000 * 1, msg, token);
}

const pushMsg = async (msg, token) => {
  try {
    await sendPushMsg(msg, token);
    return [token, true];
  } catch (e) {
    return [token, false];
  }
}

async function job() {
  await go(
    users,
    L.filter(({ age }) => age < 30 && age),
    L.map(({ name, kakaoToken }) => ([ `${name}님 공부합시다.`, kakaoToken ])),
    L.map(([ msg, token ]) => pushMsg(msg, token)),
    each(([ token, isSuccess ]) => {
      return go(
        users,
        L.find(({ kakaoToken }) => kakaoToken == token),
        user => {
					user.isSuccess = isSuccess
					return user;
				}
      )
    })
  )
}
//'N명 모두 전송을 완료했습니다.' 

(function run() {
  Promise.all([
    delay(5000, undefined),
    job()
  ])
  .then((_users) => {
    go(
      users,
      L.filter(({ isSuccess }) => isSuccess),
      reduce((acc, { name }) => `${acc} ${name}`, 'N명 모두 전송을 완료했습니다.'),
      console.log
    )
  })
  .catch((_users) => {
    go(
      users,
      L.filter(({ isSuccess }) => !isSuccess),
      reduce((acc, { name }) => `${acc} ${name}`, 'N명 전송을 실패했습니다.'),
      console.log
    )
  });
}) ();
