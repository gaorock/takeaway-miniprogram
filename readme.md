# Takeaway Miniapp

## Structrue

### APP

### PAGE

1. [x] 首页[TAB] - /pages/index/index.wxml
2. [x] 结算 - /pages/checkout/checkout.wxml
3. [x] 付款 - /pages/pay/pay.wxml
4. [x] 订单列表[TAB] - /pages/order/order.wxml
5. [x] 订单详情 - /pages/orderDetail/orderDetail.wxml
6. [x] 评价 - /pages/evaluate/evaluate.wxml
7. [x] 个人中心[TAB] - /pages/personal/personal.wxml
8. [x] 地址列表 - /pages/address/address.wxml
9. [x] 添加/修改地址 - /pages/addressAdd/addressAdd.wxml
10. [x] 充值 - /pages/topup/topup.wxml
11. [x] 用户协议 - /pages/protocol/protocol.wxml
12. [x] 订单列表(个人中心) - /pages/orderList/order.wxml
13. [ ] 优惠卷(没有接口，暂时不做) - /pages/coupon/coupon.wxml
14. [x] 账户详情 - /pages/balance/balance.wxml
15. [x] 代付转发 - /pages/otherPay/otherPay.wxml

### PROBLEMS

1. [x] order miss status - after evaluate but finished
2. [x] '/user/Profile/userInfo' - return 'total_consume_price': 693.6499999999999
3. [x] need to test settlement without fixed delivery areas.
4. [x] checkout page, if server set 'delivery_type' - 1配送2自取3随意, then api should return 'delivery_type', now is only 3 for testing.
5. [x] address list need to add 'click to select' function for checkout page when delivery is free address.

### COMPONENETS

1. [x] amountButton
2. [x] bottomCart
3. [x] commits
4. [x] coupon
5. [x] error
6. [x] loading
7. [x] openSetting
8. [x] popup
9. [x] selectItem

10. [x] menu

```javascript
properties: {
  show: Boolean,
  cartItem: Object
}

data: {
  menuCate: Array,
  menuIndex: Number,
  products: Array
}
```

### TEMPLATE

1. [x] orderDetail
    - [x] deliver.wxml
    - [x] refund.wxml
    - [x] finish.wxml
  
2. [x] orderList.wxml

### UTILITY

1. [x] fetch.js
2. [x] api.js
3. [x] checkLogin.js - can be replaced
4. [x] checkPermission.js
5. [x] formatData.js
6. [x] formatPrice.js
7. [x] login.js
8. [x] util.js - ```formatTime```
9. [x] md5.js[unused]
10. [x] sha256.js[unused]

### Dependencies

```json
"dependencies": {
  "jssha": "^3.2.0",
  "miniprogram-file-uploader": "^1.0.0",
  "validator": "^13.5.2"
}
```

## API

### ```https://waimai.douxiaoxu.com/api/```

### common

1. [x] 获取openid [GET] ```getOpenID: 'wx/public/login'```
2. [x] 获取首页数据 [GET] ```getHomeData: 'home/index/home'```
3. [x] 获取用户留言 [GET]?page=1 ```getCommits: 'user/goods_comments/comments_list'```

### product

1. [x] 协议 [GET] (null) ```getAgreement: 'user/Order/agreement'```
2. [x] 商铺详情 [GET] (null) ```getShopDetail: 'home/index/shopDetail'```
3. [x] 多规格 [GET]?id= ```getMultiSpecProduct: 'home/index/param'```
4. [x] 多规格 价格 [GET]?id=&param1=&param2=&param3=&...
 ```getMultiSpecProductPrice: 'home/index/param_price'```

### order

1. [x] 结算 [POST] {type: 1|2自取} ```postSettleOrder: 'user/order/settlement'```
2. [x] 去下订单 [POST] ```postAddOrder: 'user/order/addOrder'```
3. [x] 获取下单订单详情 [GET] ```getOrderDetail: 'user/order/get_order_detail'```

### pay

1. [x] 账户充值 [POST] ```postTopUp: '/user/balance/WxPay',```
2. [x] 充值金额列表 [GET] (null) ```getTopUpAmountList: '/user/Balance/recharge_list'```
3. [x] 微信支付 [POST] id ```postWeixinPay: 'user/order/WxPayOrder'```
4. [x] 余额支付 [POST] id ```postBalancePay: 'user/order/balance_pay'```
5. [x] 余额明细 [GET] (null) ```getBalanceLogs: '/user/balance/logs'```
6. [x] 发起代付 [POST] ```otherPay: 'user/dai_pay_order/dai_pay_btn'```
7. [x] 代付详情 [POST] ```getOtherPay: '/user/dai_pay_order/dai_pay_page'```
8. [x] 代付付款 [POST] ```otherPayRequest: '/user/dai_pay_order/dai_pay'```

### address

1. [x] 地址列表 [GET] ```getAddressList: 'user/Address/address_list'```
2. [x] 新增地址 [POST] ```postAddOrEditAddress: 'user/Address/edit_address'```
3. [x] 删除地址 [POST] id ```postDeleteAddress: 'user/Address/del_address'```
4. [x] 设置默认地址 [POST] id ```postSetDefaultAddress: 'user/Address/set_mr'```
5. [x] 地址详情 [GET] id ```getAddressDetail: 'user/Address/addressDetail'```
6. [x] remove 配送区域 [GET]（null）```getAreaFromServer: 'user/address/area'```

### orderlist

1. [x] 获取订单列表 [GET] ```getOrderList: 'user/Order/orderlist'```
2. [x] 订单详情 [GET] id ```getOrderDetail: 'user/Order/orderdetail'```
3. [x] 确认收货 [POST] id ```receiveOrder: 'user/order/shouhuo'```
4. [x] 取消并申请退款 [POST] id ```postOrderRefund: 'user/order/refundorder'```

### user

1. [x] 获取用户账户信息 [GET] (null) ```getUserInfo: '/user/Profile/userInfo'```

### commit

1. [x] 添加用户评价 [POST] ```ostAddCommit: 'user/goods_comments/addComments'```

### other

1. [x] 上传图片 [FILE] ```uploadOneImage: 'user/upload/wxapp_one'```
