const login = require('../../utils/login');

// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    list: [
      {name: 1, id: 1, status: 0, text: '配送中', single: true},
      {name: 2, id: 2, status: 1, text: '待付款'},
      {name: 3, id: 3, status: 2, text: '已完成'},
      {name: 4, id: 4, status: 3, text: '已退款', single: true}
    ],
    login: false
  },

  changeTab (e) {
    const { index } = e.currentTarget.dataset;
    console.log({index})
    if (index === 2) this.setData({list: []});
    if (index !== this.data.tabIndex) this.setData({tabIndex: index});
  },

  // template Event
  navigate (e) {
    const { id, status } = e.currentTarget.dataset;
    if (parseInt(status) === 1) return; // ignore 'wait to pay'
    console.log({id})
    wx.navigateTo({
      url: `../orderDetail/orderDetail?id=${id}&type=${status}`
    })
  },

  oneMoreOrder (e) {
    const { id } = e.currentTarget.dataset;
    console.log('oneMoreOrder', id)
  },

  evaluate (e) {
    const { id } = e.currentTarget.dataset;
    console.log('evaluate', id)
  },

  toPay (e) {
    const { id } = e.currentTarget.dataset;
    console.log('toPay', id)
  },

  goHome () {
    console.log('gohome')
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  async login () {
    const res = await login();
    console.log(res);
    if (res) {
      this.setData({login: true})
      this._getOrderList();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const token = wx.getStorageSync('token');
    this.setData({login: !!token});
  },

  _getOrderList () {
    // ...
  
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