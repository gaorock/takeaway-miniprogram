const login = require('../../utils/login');
// pages/coupon/coupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {id: 1, amount: 4, limit: 20, date: '2021-03-06', status: 0},
      {id: 2, amount: 5, limit: 30, date: '2021-03-06', status: 0},
      {id: 3, amount: 12, limit: 60, date: '2021-03-06', status: 1},
      {id: 4, amount: 20, limit: 100, date: '2021-03-06', status: 2},
      {id: 5, amount: 4, limit: 20, date: '2021-03-06', status: 0},
      {id: 6, amount: 4, limit: 20, date: '2021-03-06', status: 0},
      {id: 7, amount: 4, limit: 20, date: '2021-03-06', status: 0},
      {id: 8, amount: 4, limit: 20, date: '2021-03-06', status: 0},
    ],

    tabIndex: 0,
    login: false
  },
  
  onTapChange (e) {
    const {id}= e.currentTarget.dataset;
    this.setData({tabIndex: id})
  },  

  async login () {
    const res = await login();
    if (res) {
      // ...
      wx.switchTab({
        url: '/pages/personal/personal'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const token = wx.getStorageSync('token');
    console.log(!!token)
    this.setData({login: !!token});
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