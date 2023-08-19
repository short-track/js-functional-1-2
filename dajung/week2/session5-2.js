const _ = require('fxjs/Strict')
const L = require('fxjs/Lazy')

const Impt = {
    payments: {
      1: [
        { imp_id: 11, order_id: 1, amount: 15000 },
        { imp_id: 12, order_id: 2, amount: 25000 },
        { imp_id: 13, order_id: 3, amount: 10000 }
      ],
      2: [
        { imp_id: 14, order_id: 4, amount: 25000 },
        { imp_id: 15, order_id: 5, amount: 45000 },
        { imp_id: 16, order_id: 6, amount: 15000 }
      ],
      3: [
        { imp_id: 17, order_id: 7, amount: 20000 },
        { imp_id: 18, order_id: 8, amount: 30000 }
      ],
      4: [],
      5: [],
      //...
    },
    getPayments: page => {
      console.log(`http://..?page=${page}`);
      return _.delay(1000 * 1, Impt.payments[page]);
    },
    cancelPayment: imp_id => Promise.resolve(`${imp_id}: 취소완료`)
};

const DB = {
    getOrders: ids => _.delay(100, [
        { id: 1 },
        { id: 3 },
        { id: 7 }
    ])
};

// 시나리오
// 1. 아임포트 결제 모듈을 사용하고 있다.
// 2. 여러가지 이유로 결제가 제대로 이뤄지지 않을 수 있다.
// 3. 아임포트 API를 이용하여 실제 결제된 데이터를 가져온다
// 4. 주문된 데이터와 결제된 데이터를 비교하여 
//    결제되지 않은 주문데이터는 환불 처리 한다

async function job() {
    // 결제된 결제모듈측 payments 가져온다.
    // page 단위로 가져오는데,
    // 결제 데이터가 있을 때까지 모두 가져와서 하나로 합친다.
    const payments = await _.go(
        // 스케줄러이기 때문에 계속 동작해야하므로 infinity값을 준다
        L.range(1, Infinity),
        L.map(Impt.getPayments),
        // takeWhile을 쓰지 않는 이유는 필요한 요청보다
        // 한번 더 요청하기 때문이다.
        L.takeUntil(({length}) => length < 3),
        _.flat);
    console.log(payments)

    const orders = await _.go(
        payments,
        _.map(p => p.order_id),
        DB.getOrders,
        _.map(({id}) => id));
    console.log(orders)
    

    // payment와 orders를 비교하여 취소처리
    await _.go(
        payments,
        // order가 존재하면 정상적인 결제 이기 때문에 취소하면 안된다
        L.reject(p => orders.includes(p.order_id)),
        L.map(p => p.imp_id),
        _.map(Impt.cancelPayment),
        _.each(console.log)
    )

}

// job()

// 스케줄러이기 때문에 계속 실행하게 해야한다
(function recur() {
    // Promise.all은 내부의 promise가
    // 병렬적으로 실행되고 모두 실행되면
    // then이 실행된다
    Promise.all([
        _.delay(7000, undefined),
        job()
    ]).then(recur);
}) ();
