const {getOpenIDUrl} = require('../../utils/api');
const fetch = require('../../utils/fetch');
// const SHA = require("jssha");

// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    method: 0,
    money: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.money) this.setData({money: options.money});
    if (options.id) this._id = options.id;
    const that = this;
    
    

    // this.pay();


    // wx.chooseAddress({
    //   success (res) {
    //     console.log(res.userName)
    //     console.log(res.postalCode)
    //     console.log(res.provinceName)
    //     console.log(res.cityName)
    //     console.log(res.countyName)
    //     console.log(res.detailInfo)
    //     console.log(res.nationalCode)
    //     console.log(res.telNumber)
    //   }
    // })
    
    
    
  },

  pay () {
    const that = this;

    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log({res});

        wx.login({
          success (loginRes) {
            if (loginRes.code) {
              //发起网络请求
              console.log('login ok', {code: loginRes.code})
    
              that.getOpenID({
                code: loginRes.code, 
                appid: 'wxc953033086b6b2b7', 
                signature: res.signature, 
                encryptedData: res.encryptedData, 
                iv: res.iv, 
                raw_data: res.userInfo, 
                user_type: 2
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
        
      }
    })
  },


  async getOpenID ({code, appid, signature, encryptedData, iv, raw_data, user_type}) {
    const response = await fetch(getOpenIDUrl, {
      method: 'POST',
      data: {code, appid, signature, encryptedData, iv, raw_data, user_type}
    });
    console.log({response})
  },

  changeMethod (e) {
    const {method} = e.currentTarget.dataset;
    if (method !== this.data.method) this.setData({method});
  },

  cancel () {
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