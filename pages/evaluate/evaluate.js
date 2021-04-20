const MD5 = require('../../utils/md5');
const SHA = require('../../utils/sha256');

// pages/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {}, // updated when id changes

    star: [1,0,0,0,0],
    commit: '',
    photos: []
  },

  _MAX_PHOTO_SIZE: 3,

  clickStar (e) {
    const {idx} = e.currentTarget.dataset;
    const newStar = this.data.star.map((s, i) => {
      if (i <= idx) s = 1; else s = 0;
      return s
    });

    this.setData({ star: newStar })
  },

  commitChange (e) {
    const {value} = e.detail;
    this.setData({commit: value})
  },

  deletePhoto (e) {
    const {idx} = e.currentTarget.dataset;
    const newPhotos = this.data.photos.filter((p, i) => i !== idx)
    this.setData({photos: newPhotos});
  },


  chooseImage () {
    const that = this;
    const length = this.data.photos.length;

    if (length === this._MAX_PHOTO_SIZE) return;

    wx.chooseMedia({
      count: this._MAX_PHOTO_SIZE - length,
      mediaType: 'image',
      success: function (res) {
        console.log(res)
        const photos = res.tempFiles.map(i => i.tempFilePath)
        that.setData({
          photos: [...that.data.photos, ...photos]
        })
      },
      complete: function () {
        console.log('complete')
      },
      fail: function () {
        console.log('fail')
      }
    })
  },

  onSubmit () {
    const stars = this.data.star.reduce((a, c) => a + c, 0);

    console.log({
      stars, 
      commit: this.data.commit,
      photos: this.data.photos
    })

    console.log(MD5(123))
    
    // const sha256 = new SHA("SHA-256", "TEXT", { encoding: "UTF8" })
    // sha256.update('asdaklsdaklsdjalskd')
    // const kmac = sha256.getHash("B64", { outputLen: 256 });
    // console.log(kmac)
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id} = options;
    if (!id) return;
    console.log('evaluate page:', {id})
    // get order data with id
    // then set data to rerender page
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