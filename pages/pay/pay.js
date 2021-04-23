const URLs = require('../../utils/api');
const fetch = require('../../utils/fetch');
// const SHA = require("jssha");

// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    method: 0,
    money: 0,
    order_sn: '',
    order_id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    const {order_id} = options;

    

    if (!order_id) {
      return  wx.switchTab({url: '/pages/index/index'})
    } else {

      const order = await fetch(URLs.getOrderDetail, {
        method: 'POST',
        data: {id: options.order_id}
      })
      if (order.code === 1) {
        // clear cart and order status will change in backend
        wx.removeStorageSync('cart');

        this._order_sn = order.data.order_sn;
        this.setData({
          money: order.data.price,
          order_sn: order.data.order_sn,
          order_id
        })
      } 
      console.log(order)

      const balance = await fetch(URLs.getUserInfo);
      this.setData({balance: balance.data.balance})

      console.log(balance)
    }
    
    
    
  },

  async pay () {
    const {method, order_id} = this.data;

    if (method === 0) {
      // weixin pay
      const weixin_pay_res = await fetch(URLs.postWeixinPay, {
        method: 'POST',
        data: {
          id: order_id
        }
      })

      if (weixin_pay_res.code === 1) {
        // ok
        wx.requestPayment({
          timeStamp: weixin_pay_res.data.timeStamp,
          nonceStr: weixin_pay_res.data.nonceStr,
          package: weixin_pay_res.data.package,
          paySign: weixin_pay_res.data.paySign,
          signType: weixin_pay_res.data.signType,
          success () {
            console.log('winxin pay success!')
            try {
              wx.removeStorageSync('cart')
              wx.switchTab({url: '/pages/order/order'})
            } catch (e) {
              // Do something when catch error
            }
            
          },
          fail (e) {
            console.warn(e)
          }
        })
      } 

      console.log({weixin_pay_res})

    } else if (method === 1) {
      // balance pay

      const balance_pay_res = await fetch(URLs.postBalancePay, {
        method: 'POST',
        data: {
          id: order_id
        }
      })

      if (balance_pay_res.code === 1) {
        // ok
        console.log('balance pay success!')
        try {
          wx.removeStorageSync('cart')
          wx.switchTab({url: '/pages/order/order'})
        } catch (e) {
          // Do something when catch error
        }
        
      } else {
        // error
        console.log(balance_pay_res.msg)
      }
      console.log({balance_pay_res})
    }
    
    console.log({pay_method: method })
   
  },

  changeMethod (e) { 
    const {method} = e.currentTarget.dataset;
    if (method !== this.data.method) this.setData({method});
  },

  cancel () {
    wx.navigateBack({
      delta: 1,
      fail () {
        wx.switchTab({url: '/pages/order/order'})
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
    

    const promise = new Promise(async (resolve, reject) => {
      console.log(URLs.otherPay)
      try {
        const res = await fetch(URLs.otherPay, {
          method: 'POST',
          data: {
            order_sn: this._order_sn
          }
        })

        if (res.code === 1) {
          // wx.switchTab({url: '/pages/order/order'})
          resolve({
            title: 'Hi～你和我的距离只差一顿外卖～',
            path: `/page/otherPay/otherPay?new_order_sn=${res.new_order_sn}`,
            imageUrl: res.data.share_img
          })
        }

        console.log(res)
        

      } catch(e) {
        reject('error')
      }
      
    })




    return {
      title: '有错误！不要分享！',
      path: '/page/index/index',
      imageUrl: 'https://waimai.douxiaoxu.com/upload/share/11.png',
      promise
    }
  }
})