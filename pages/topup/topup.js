const URLs = require('../../utils/api');
const fetch = require('../../utils/fetch');

// pages/topup/topup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topupOption : [
      {id: 1, recharge_price: 100, give_price: 10},
      {id: 2, recharge_price: 150, give_price: 15},
      {id: 3, recharge_price: 200, give_price: 20},
      {id: 4, recharge_price: 300, give_price: 30},
      {id: 5, recharge_price: 400, give_price: 50},
      {id: 6, recharge_price: 500, give_price: 60},
    ],
    optionID: 1,
    customTopup: '',
    balance: '0.00',
  },

  onOptionChange (e) {
    const {id} = e.currentTarget.dataset;
    // if any option is selected, clear up 'customTopup' input box
    if (this.data.customTopup) this.setData({customTopup: ''});
    this.setData({optionID: id})
  },

  onInputChange (e) {
    const {value} = e.detail;
    if (parseFloat(value) === NaN) return;
    // if input any 'customTopup' amount, then clear up selected option
    if (value && this.data.optionID !== null) this.setData({optionID: null});

    this.setData({customTopup: value})
  },

  onSubmit () {
    let amount;
    if (parseFloat(this.data.customTopup) > 0) amount = parseFloat(this.data.customTopup);
    else {
      const selected = this.data.topupOption.filter(op => op.id === this.data.optionID)[0]
      amount = selected.amount
    }
    console.log({amount})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const res = await fetch(URLs.getTopUpAmountList);
    if (res.code === 1) {
      const list = res.data.list.map(i => {
        i.recharge_price = i.recharge_price.split('.')[0];
        i.give_price = i.give_price.split('.')[0];
        return i
      })
      this.setData({topupOption: res.data.list})
    }

    const balance = await fetch(URLs.getUserInfo);
    if (balance.code === 1) this.setData({balance: balance.data.balance})
    console.log(balance)
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