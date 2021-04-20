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
    id: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id, type } = options;
    this.setData({ detailType: parseInt(type) , id})
  },

  oneMoreOrder () {
    console.log('oneMoreOrder');
    wx.switchTab({ url: '/pages/index/index'})
  },

  toEvaluate () {
    console.log('toEvaluate', this.data.id);
    wx.navigateTo({ url: '/pages/evaluate/evaluate?id='+this.data.id})
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