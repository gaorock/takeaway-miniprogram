const URLs = require('../../utils/api');
const fetch = require('../../utils/fetch');
// pages/otherPay/otherPay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    avatar: '',
    list: [],
    payAmount: 0,
    status: 0,    // 0待支付 1已支付 4已取消

    placeholder: 0,
    gotData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const { new_order_sn } = options;
    this._new_order_sn = new_order_sn;
    console.log(new_order_sn, this._new_order_sn)

    const sys = wx.getSystemInfoSync();
    console.log(sys)
    this.setData({
      placeholder: sys.safeArea.bottom - sys.safeArea.height
    })

    const res = await fetch(URLs.getOtherPay, {
      method: 'POST',
      data: {new_order_sn}
    })

    if (res.code !== 1) return;

    this.setData({
      username: res.data.user_data.user_nickname,
      avatar: res.data.user_data.avatar,
      payAmount: res.data.price,
      status: res.data.order_status,
      list: res.data.order_detail,

      gotData: true
    })

    console.log(res)
  },


  topay () {
    const that = this;
    if (this._clicked) return;
    this._clicked = true;

    wx.login({
      async success (e) {
        console.log(e, that._new_order_sn)
        // 1. get code, send to server, exchange transection details
        const codeRes = await fetch(URLs.otherPayRequest, {
          method: 'POST',
          data: {
            code: e.code,
            new_order_sn: that._new_order_sn
          }
        })
        console.log(codeRes)

        if (codeRes.code !== 1) return

        console.log('topay')
        // 2. pay action
        wx.requestPayment({
          timeStamp: codeRes.data.timeStamp, //	string		是	时间戳，从 1970 年 1 月 1 日 00:00:00 至今的秒数，即当前的时间
          nonceStr: codeRes.data.nonceStr, //	string		是	随机字符串，长度为32个字符以下
          package: codeRes.data.package, //	string		是	统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***
          signType: codeRes.data.signType, //	string	MD5	否	签名算法，应与后台下单时的值一致
          paySign: codeRes.data.paySign, //	string		是	签名，具体见微信支付文档
          success () {
            console.log("pay ok")
            that.setData({status: 9})
          }	,
          fail(e) {
            console.log("pay cancel")
            console.log(e)
          },
          complete () {
            that._clicked = false;
          }
        })

      },
      fail(e) {
        console.log('fail')
        console.log(e)
      }
    })
  },

  findother () {
    wx.switchTab({
      url: '/pages/index/index'
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



