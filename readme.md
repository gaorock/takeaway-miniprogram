# Takeaway Miniapp

## Structrue

### APP

### PAGE

1. [x] home - index.wxml
2. [ ] checkout - checkout.wxml
3. [ ] order
4. [ ] person

### COMPONENET

- menu

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

- commits

```javscript
properties: {
  xid: Number, // product_id
}
```

- bottomCart
- oupon
- amountButton
- selectItem
- loading

### TEMPLATE





### UTILITY

#### 1. fetch

```javascript
url: String,

option: {
  method: "GET",
  data: {}
}
```

## Map

### home

- "Cart": "bottomCart"
- "Coupon": "coupon"
- "Menu": "menu"
  - Amount
- "Select": "selectItem"
  - Amount
  - Loading

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
2. [ ] 去下订单 [POST] ```postAddOrder: 'user/order/addOrder'```
3. [ ] 获取下单订单详情 [GET] ```getOrderDetail: 'user/order/get_order_detail'```

### pay

1. [ ] 账户充值 [POST] ```postTopUp: '/user/balance/WxPay',```
2. [ ] 充值金额列表 [GET] (null) ```getTopUpAmountList: '/user/Balance/recharge_list'```
3. [ ] 微信支付 [POST] id ```postWeixinPay: 'user/order/WxPayOrder'```
4. [ ] 余额支付 [POST] id ```postBalancePay: 'user/order/balance_pay'```
5. [ ] 余额明细 [GET] (null) ```getBalanceLogs: '/user/balance/logs'```

### address 

1. [ ] 地址列表 [GET] ```getAddressList: 'user/Address/address_list'```
2. [ ] 新增地址 [POST] ```postAddOrEditAddress: 'user/Address/edit_address'```
3. [ ] 删除地址 [POST] id ```postDeleteAddress: 'user/Address/del_address'```
4. [ ] 设置默认地址 [POST] id ```postSetDefaultAddress: 'user/Address/set_mr'```
5. [ ] 地址详情 [GET] id ```getAddressDetail: 'user/Address/addressDetail'```
6. [ ] 配送区域 [GET]（null）```getAreaFromServer: 'user/address/area'```

### orderlist

1. [ ] 获取订单列表 [GET] ```getOrderList: 'user/Order/orderlist'```
2. [ ] 订单详情 [GET] id ```getOrderDetail: 'user/Order/orderdetail'```
3. [ ] 确认收货 [POST] id ```receiveOrder: 'user/order/shouhuo'```
4. [ ] 取消并申请退款 [POST] id ```postOrderRefund: 'user/order/refundorder'```

### user

1. [ ] 获取用户账户信息 [GET] (null) ```getUserInfo: '/user/Profile/userInfo'```

### commit

1. [ ] 添加用户评价 [POST] ```ostAddCommit: 'user/goods_comments/addComments'```

### other

1. [ ] 上传图片 [FILE] ```uploadOneImage: 'user/upload/wxapp_one'```
