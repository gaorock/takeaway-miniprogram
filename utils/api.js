const DOMIN = 'https://waimai.douxiaoxu.com/api';

const api = {
  // 获取openid - GET
  getOpenID: 'wx/public/login',
  // 获取首页数据 - GET
  getHomeData: 'home/index/home',
  // 获取用户留言 - GET?page=1
  getCommits: 'user/goods_comments/comments_list',


  /** @name 产品 */
  // 协议 - GET (null)
  getAgreement: 'user/Order/agreement',
  // 商铺详情 - GET  (null)
  getShopDetail: 'home/index/shopDetail',
  // 多规格 - GET?id=
  getMultiSpecProduct: 'home/index/param',
  // 多规格 价格 - GET?id=&param1=&param2=&param3=&...
  getMultiSpecProductPrice: 'home/index/param_price',


  /** @name 下单 */
  // 结算 - {type: 1|2自取}
  // 1 - address_id （address id）
  // 2 - lng: , lat:
  // goods: [], {id, subId, num}
  
  /** 1. area
   * {
   *  delivery_area: [],
   *  freight: 0,
   *  price: 0,
   *  total_price: 0,
   *  youhui: ''
   * }
   * 1. detail
   * {
   *  address: {},
   *  error_msg: '',   超出范围
   *  freight: 0，
   *  price：0，
   *  time： '',
   *  total_price: '',
   *  youhui: '',
   * }
   * 
   * goods: [..., stock]
   * 
   */
  postSettleOrder: 'user/order/order_page',
  // 去下订单
  // remark: '' //备注信息
  // freight: ''  //配送费
  // youhui: '' // 优惠
  // price: '' //总价，
  // man_price: 0 //满减
  // type: 1|2 // 1配送id2自取
  // 1.1 address_id: 48,
  // 
  // 1.2.1 contact
  // 1.2.2 mobile
  // 1.2.3 area

  // 2.1 ziqu_time: HH-MM
  // 2.2 mobile:
  // goods: [] {id, subId, num} 

  // return: order_id
  postAddOrder: 'user/order/addOrder',
  // 获取下单订单详情
  // id
  getOrderDetail: 'user/order/get_order_detail',

  /** @name 支付*/
  // 发起 账户充值
  // money
  postTopUp: '/user/balance/WxPay',
  // 充值金额列表 - GET (null)
  getTopUpAmountList: '/user/Balance/recharge_list',
  // 微信支付
  // id 订单ID
  postWeixinPay: 'user/order/WxPayOrder',
  // 余额支付
  // id 订单ID
  postBalancePay: 'user/order/balance_pay',
  // 余额明细 - GET (null)
  getBalanceLogs: '/user/balance/logs',
   /** @name 代付🥼 */
  otherPay: 'user/dai_pay_order/dai_pay_btn',
  getOtherPay: '/user/dai_pay_order/dai_pay_page',
  otherPayRequest: '/user/dai_pay_order/dai_pay',



  /** @name 收货地址 */
  // 地址列表 - GET (null) need more detail
  getAddressList: 'user/Address/address_list',
  // 新增地址 不传id / 更改地址 需要传id
  // contact: 收货人
  // phone: 电话
  // address: 省市区 
  // detail: 详细地址
  // province:
  // type: 0|1 默认地址
  // sex: 0|1 1女
  // tag: 1家2公司3学校4其他
  postAddOrEditAddress: 'user/Address/edit_address',
  // 删除地址
  // id
  postDeleteAddress: 'user/Address/del_address',
  // 设置默认地址
  // id
  postSetDefaultAddress: 'user/Address/set_mr',
  // 地址详情
  // id
  getAddressDetail: 'user/Address/addressDetail',
  // 配送区域 GET（null）- 新增/编辑地址的时候调取， 返回area空为自动输入
  getAreaFromServer: 'user/address/area',
  setDeliveryAddress: 'user/address/set_address',


  /** @name 订单列表 */
  // 3.1 status 1全部 2待发货 3待收货	4已完成 5退款
  //  return 1待发货 2已发货 3已完成 4已取消（待付款） 5退款中 6已退款 
  getOrderList: 'user/Order/orderlist',
  // 订单详情
  // id: 订单ID
  getOrderDetail: 'user/Order/orderdetail',
  // 确认收货 POST
  // id
  receiveOrder: 'user/order/shouhuo',
  // 取消并申请退款
  // id
  postOrderRefund: 'user/order/refundorder',

  /** @name 其他 */
  // 上传图片
  // file = jpg, png, gif
  uploadOneImage: 'user/upload/wxapp_one',

  // 添加用户评价
  // order_id 订单ID
  // star: 12345,
  // imgs: 'str,str,str'
  // content: '',
  postAddCommit: 'user/goods_comments/addComments',
  // 获取用户账户信息 - GET (null)
  getUserInfo: '/user/Profile/userInfo',
  // 
  getAgreement: 'user/order/agreement',

 
}

const joinedApiUrl =  {};

Object.keys(api).forEach(key => {
  joinedApiUrl[key+'Url'] = DOMIN + '/' + api[key];
  joinedApiUrl[key] = DOMIN + '/' + api[key];
})

module.exports = joinedApiUrl;