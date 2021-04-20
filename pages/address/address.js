const URLs = require('../../utils/api');
const fetch = require('../../utils/fetch');

// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    default: 1,
    list: [],
    tags: ['家', '公司', '学校', '其他'],
    login: false,
  },

  async onChangeDefault (e) {
    const {id} = e.currentTarget.dataset;
    
    const setAdd = await fetch(URLs.postSetDefaultAddress, {
      method: 'POST',
      data: {id}
    })

    if (setAdd.code !== 1) this.setData({error: '网络错误， 请稍后重试'});
    else this.setData({default: id})
  },


  addNewAddress () {
    wx.navigateTo({
      url: '../addressAdd/addressAdd'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
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
  onShow: async function () {
    console.log('onShow')
    const {code, data} = await fetch(URLs.getAddressList);
    
    if (code === 1) {
      let id = null;

      if (data.length === 1 && data[0].type !== 1) {
        // set first address as Default
        const setAdd = await fetch(URLs.postSetDefaultAddress, {
          method: 'POST',
          data: {id: data[0].id}
        })
        if (setAdd.code !== 1) this.setData({error: '网络错误， 请稍后重试'});
        else id = data[0].id;
        
      } else if (data.length >= 1) {
        console.log(data)
        const defaultAdd = data.filter(i => i.type === 1);
        if (defaultAdd.length === 0) {
          const setAdd = await fetch(URLs.postSetDefaultAddress, {
            method: 'POST',
            data: {id: data[0].id}
          })
          if (setAdd.code !== 1) this.setData({error: '网络错误， 请稍后重试'});
          else id = data[0].id;

        } else {
          id = defaultAdd[0].id;
        }
        console.log(defaultAdd)
      } 
      
      this.setData({ list: data, default: id })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
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