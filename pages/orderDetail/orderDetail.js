const URLs = require('../../utils/api');
const fetch = require('../../utils/fetch');
// pages/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderlist: [],
    checkout: {
      total_price: 0,
      price: 0,
      youhui: 0,
      deliver_fee: 0
    },
    detailType: 0,
    // id: null,

    address: '',
    detail:'',
    contact:'',
    mobile:'',

    // if is_ziqu
    is_ziqu: false,
    shop_address:'',
    shop_tel:'',
    
    // 
    statusText: ''
  },

  status: ['待付款', '待发货', '已发货', '已完成', '已取消', '退款中', '已退款'],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const { id, type, from } = options;
    // 2已发货 3已完成 5退款中
    const typeNum = parseInt(type);
    const statusText = this.status[typeNum];
    console.log({status: statusText, typeNum})


    // console.log({id, type, from})
    this._id = id;
    this._from = !!from;
    const detailRes = await fetch(URLs.getOrderDetail, {
      method: 'POST',
      data: {id}
    })
    console.log(detail)
    if (detailRes.code !== 1) return;

    const {
      create_time, 
      pay_time, 
      order_sn, 
      status, 
      orderxq, 
      remark,

      freight,
      full_reduce,
      total_price,
      price,

      address,
      detail,
      contact,
      mobile,

      is_ziqu,
      shop_address,
      shop_tel,
    } = detailRes.data;


    this.setData({ 
      detailType: parseInt(type),

      create_time, 
      pay_time, 
      order_sn, 
      status, 
      orderxq, 
      remark,

      address,
      detail,
      contact,
      mobile,

      checkout: {
        total_price,
        price,
        youhui: full_reduce,
        deliver_fee: freight
      },

      is_ziqu,
      shop_address,
      shop_tel,

      orderlist: orderxq,

      statusText 
    })
  },

  oneMoreOrder () {
    console.log('oneMoreOrder');
    wx.switchTab({ url: '/pages/index/index'})
  },

  toEvaluate (e) {
    wx.setStorageSync('orderToBeEvaluated', {
      detail: this.data.orderlist,
      price: this.data.checkout.price
    })
    console.log('toEvaluate', this.data.id);
    wx.navigateTo({ url: `/pages/evaluate/evaluate?id=${this._id}&from=1`})
  },

  

  makePhoneCall () {
    const phone = wx.getStorageSync('shop_phone');

    wx.makePhoneCall({
      phoneNumber: phone,
      success () {
        console.log('call success.')
      },
      fail () {
        console.log('call fail.')
      }
    })
  },

  async toConfirm () {
    console.log({id: this._id})
    const res = await fetch(URLs.receiveOrder, {
      method: 'POST',
      data: {id: this._id}
    })
    if (res.code === 1) this.setData({inform: '确认收货成功！'})
    console.log(res)
  },

  onMsgDown() {
    this.setData({inform: null})
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})


// 莓莓满满柠檬爽（大杯）
// 柠檬茶
// 冰阔落