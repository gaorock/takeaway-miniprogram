const URLs = require('../../utils/api');
const fetch = require('../../utils/fetch');

// pages/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], // updated when id changes
    total_price: 0,

    star: [1,0,0,0,0],
    commit: '',
    photos: [],

    uploading: false,
    error: null,
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

  upload (img) {
    const that = this;
    if (!this._token) this._token = wx.getStorageSync('token');

    return new Promise(resolve => {
      wx.uploadFile({
        url: URLs.uploadOneImage,
        filePath: img,
        name: 'file',
        header: {
          "Cache-Control": "no-cache",
          'XX-Api-Version': '1.0',
          'XX-Byte-AppId': 'wxc953033086b6b2b7',
          'XX-Device-Type': 'wx',
          'XX-Token': that._token,
        },
        success (e) {
          if (e.statusCode !== 200) resolve(false)
          
          const data = JSON.parse(e.data);
          if (data.code !== 1) resolve(false)
          // success
          resolve(data.data.url)            
        },
        fail () {
          console.log('fail');
          resolve(false)
        }
      })
    })
  },


  chooseImage () {
    const that = this;
    const length = this.data.photos.length;

    if (length >= this._MAX_PHOTO_SIZE) return;

    wx.chooseMedia({
      count: this._MAX_PHOTO_SIZE - length,
      mediaType: 'image',
      success: async function (res) {
        const photos = res.tempFiles.map(i => i.tempFilePath);
        const upload = [];

        that.setData({uploading: true})

        for(const img of photos) {
          // multi
          upload.push(await that.upload(img));
        }

        

        Promise.all(upload).then(passRes => {

          const pass = passRes.filter(img => img);
          console.log({pass})
          const invalid = photos.length - pass.length;
          if (invalid > 0) that.setData({error: `有${invalid}张照片上传失败，请重新上传！`});

          that.setData({
            uploading: false,
            photos: [...that.data.photos, ...pass]
          })
        }).catch(e => {
          console.log(e)
          that.setData({error: `照片上传失败，请重新上传！`, uploading: false,});
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

  async onSubmit () {
    const stars = this.data.star.reduce((a, c) => a + c, 0);

    const data = {
      order_id: this._id,
      star: stars, 
      content: this.data.commit,
      imgs: this.data.photos.join(',')
    }
    console.log(data)

    const res = await fetch(URLs.postAddCommit, {
      mehtod: 'POST',
      data
    })

    if (res.code === 1) {
      this._success = true;
      this.setData({error: '评论成功！'})
    } else {
      this.setData({error: '操作失败，请稍后重试！'})
    }

    console.log(res)

  },


  onErrorDown () {
    this.setData({error: null})
    if (this._success) {
      if (this._from) {
        wx.navigateBack({delta: 2})
      } else {
        wx.navigateBack({delta: 1})
      }
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id, from} = options;
    if (!id) return;
    this._from = !!from;
    this._id = id;

    const orderToBeEvaluated = wx.getStorageSync('orderToBeEvaluated');
    console.log({orderToBeEvaluated})
    if (orderToBeEvaluated) {
      this.setData({list: orderToBeEvaluated.detail, total_price: orderToBeEvaluated.price})
    }
    console.log('evaluate page:', {order_id: id, from})
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