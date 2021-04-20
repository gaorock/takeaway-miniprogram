const URLs = require('../../utils/api');
const fetch = require('../../utils/fetch');

// pages/balance/balance.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: '0.00',
    logs: []
  },

  topup () {
    wx.navigateTo({
      // order with refund status
      url: '../topup/topup'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const token = wx.getStorageSync('token');
    if (!token) return this.setData({login: false});
    
    this.setData({login: true});
    const balance = await fetch(URLs.getUserInfo);
    if (balance.code === 1) this.setData({balance: balance.data.balance})
    

    const logs = await fetch(URLs.getBalanceLogs);
    console.log(logs)
    if (logs.code === 1) this.setData({logs: logs.data.list.data})
    
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