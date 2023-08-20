const _ = require('fxjs/Strict')
const L = require('fxjs/Lazy')

let users = [
	{ name: 'A', phone: '010-0000-0000', kakaoToken: 'adfjladfjdafs', age: 25, gender: '남성', isSuccess: null },
	{ name: 'B', phone: '010-0000-0000', kakaoToken: 'adfjladfjdafs', age: 30, gender: '남성', isSuccess: null },
	{ name: 'C', phone: '010-0000-0000', kakaoToken: 'adfjladfjdafs', age: 34, gender: '여성', isSuccess: null },
	{ name: 'D', phone: '010-0000-0000', kakaoToken: 'adfjladfjdafs', age: 24, gender: '여성', isSuccess: null },
	{ name: 'E', phone: '010-0000-0000', kakaoToken: 'adfjladfjdafs', age: 22, gender: '여성', isSuccess: null },
  { name: 'F', phone: '010-0000-0000', kakaoToken: 'adfjladfjdafs', age: 19, gender: '남성', isSuccess: null }
]

// [조건 1] 전송할 메시지
// - '{??}님 공부합시다.'


// [조건 2] 카카오 PUSH 전송 API는 아래 함수를 사용해주세요
const sendPushMsg = (msg, token) => {
	//return fetch('https://xxxx.com/api', params);
  return _.delay(1000 * 1, msg, token);
}


// [조건 3] 모든 전송 작업이 완료 되었을 시 해줘야 할 작업
// 성공했을 때 메시지
// 'N명 모두 전송을 완료했습니다.'

// 실패했을 때 메시지
// 'N명 전송을 실패했습니다.'

async function job() {
    const push = await _.go(
        users,
        L.map(user => {
            user.isSuccess = false
            return user
        }),
        L.filter(user => user.age <= 30),
        L.filter(user => user.gender === '여성'),
        L.map(user => [user.kakaoToken, `${user.name}님 공부합시다`]),
        L.map(([msg, token]) => sendPushMsg(msg, token)),
        L.takeUntil(({length}) => length < 4),
        _.flat);

    return await _.go(
        users,
        L.map(user => {
            push.forEach(p => {
                if (user.kakaoToken === token) {
                    user.isSuccess = true
                }
            });
        })
        _.each(console.log)
    )

}

(function recur() {
    try {
        Promise.all([
            _.delay(7000, undefined),
            job()
        ])
        .then((result) => {
            const [_, tokens] = result 
            if (tokens.length !== users.length) {
                throw new Error(`${users.length}명 전송을 실패하였습니다`)
            }

            console.log(`${tokens.length}명 전송을 완료하였습니다`)
            recur()
        })
    } catch (err) {
        console.log(err)
        recur()
    }
}) ();
