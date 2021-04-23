const URLs = require('../../utils/api');
const fetch = require('../../utils/fetch');
const check_login = require('../../utils/checkLogin');
const login = require('../../utils/login');

// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: false,
    balance: '0.00',
    consume: '0.00',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const login = check_login();
    this.setData({login})

    const balance = await fetch(URLs.getUserInfo);
    if (balance.code === 1) {
      this.setData({
        balance: balance.data.balance,
        consume: this._formatMoney(balance.data.total_consume_price)
      })
    }
    
    
  },

  _formatMoney (money) {
    const moneyArray = money.toString().split('.');
    if (!moneyArray[1]) moneyArray[1] = '00';
    return moneyArray.join('.')
  },

  async getUserProfile () {
    if (this.data.login) return;
    const res = await login();
    console.log({login: res})
  },



  openSetting () {
    wx.getSetting({
      withSubscriptions: true,
      success (res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
        console.log(res.subscriptionsSetting)
        // res.subscriptionsSetting = {
        //   mainSwitch: true, // 订阅消息总开关
        //   itemSettings: {   // 每一项开关
        //     SYS_MSG_TYPE_INTERACTIVE: 'accept', // 小游戏系统订阅消息
        //     SYS_MSG_TYPE_RANK: 'accept'
        //     zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: 'reject', // 普通一次性订阅消息
        //     ke_OZC_66gZxALLcsuI7ilCJSP2OJ2vWo2ooUPpkWrw: 'ban',
        //   }
        // }
      }
    })
    wx.openSetting({
      success (res) {
        console.log(res.authSetting);
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
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