const URLs = require('../../utils/api');
const fetch = require('../../utils/fetch');
const {isMobilePhone} = require('validator');

// pages/addressAdd/addressAdd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // customItem: [],
    region: [],
    locationString: '请选择所在地址',
    locationChanged: false,

    contact: '',
    phone: '',
    tags: ['家', '公司', '学校', '其他'],
    tagIndex: 0,
    sex: ['先生', '女士'],
    sexIndex: 0,

    area: [], // length can be 0, if 0 user can write their onw 
    // picked: null, // removed

    id: null,
    detail: null,

    error: null,
  },

  onInputName (e) {
    this.setData({contact: e.detail.value})
    // this.data.contact = e.detail.value
  },

  onInputPhone (e) {
    this.setData({phone: e.detail.value})
    // this.data.phone = e.detail.value
  },

  onChangeTag (e) {
    const {id} = e.currentTarget.dataset;
    this.setData({tagIndex: id})
  },
  
  onChangeSex (e) {
    const {id} = e.currentTarget.dataset;
    this.setData({sexIndex: id})
  },

  onRegionChange (e) {
    if (!this.data.locationChanged) this.setData({locationChanged: true});
    const {value} = e.detail;
    this.setData({
      region: value,
      locationString: `${value[0]} ${value[1]} ${value[2]}`
    })
  },

  onInputDetail (e) {
    this._detail = e.detail.value;
    // this.setData({addDetail: e.detail.value})
  },

  onAreaChange (e) {
    console.log(e.detail.value)
    this.setData({ picked: e.detail.value})
  },

  async delete () {
    console.log({del: this.data.id})
    if (!this.data.id) return;
    const res = await fetch(URLs.postDeleteAddress, {
      method: 'POST',
      data: {id: this.data.id}
    });

    console.log(res)
    if (res.code === 1) {
      wx.navigateBack({
        delta: 1
      })
    }
  },


  async submit () {
    console.log({
      contact: this.data.contact,
      phone: this.data.phone,
      address: this.data.locationString,
      // detail: this.data.area.length === 0? this._detail: this.data.area[this.data.picked],
      detail: this._detail,
      province: this.data.region[0],
      type: 0,
      sex: this.data.sexIndex,
      tag: this.data.tagIndex+1
    })

    if (!this.data.contact || this.data.contact.length === 0) return this.setData({error: '联系人不能为空'})
    if (this.data.contact && this.data.contact.length > 20) return this.setData({error: '联系人长度超过最大值'})
    if (!this.data.phone || !isMobilePhone(this.data.phone.toString(), 'zh-CN')) return this.setData({error: '电话格式不正确'})
    if (this.data.region.length === 0) return this.setData({ error: '请选择城市地区'})
    // if (this.data.area.length === 0 && (!this._detail || this._detail.length === 0)) this.setData({error: '地址详情不能为空'});
    if (!this._detail) this.setData({error: '地址详情不能为空'});
    // else if (this.data.picked === null) return this.setData({ error: '请选择配送区域'})

    const res = await fetch(URLs.postAddOrEditAddress, {
      method: 'POST', 
      data: {
        id: this.data.id, 
        contact: this.data.contact,
        phone: this.data.phone,
        address: this.data.locationString,
        // detail: this.data.area.length === 0? this._detail: this.data.area[this.data.picked],
        detail: this._detail,
        province: this.data.region[0],
        type: 0,
        sex: this.data.sexIndex,
        tag: this.data.tagIndex+1
      }
    })

    if (res.code === 1) {
      wx.navigateBack({
        delta: 1
      })
    } else if (res.code === 0) {
      this.setData({ error: res.msg })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const {id} = options;

    // add/edit address page remove area selection, 
    // only select restricted area in order settlement if need
    // const area = await fetch(URLs.getAreaFromServer);
    // if (area.code === 1) this.setData({ area: area.data });

    if (id) {
      const detail = await fetch(URLs.getAddressDetail, {
        method: 'POST',
        data: {id}
      });
      if (detail.code === 1) {

        // let picked;
        
        // area.data.forEach((v, idx) => {
        //   if (v === detail.data.detail)  {
        //     picked = idx
        //   }
        // })

        this.setData({
          id,
          detail: detail.data, 
          contact: detail.data.contact,
          phone: detail.data.phone,
          sexIndex: detail.data.sex,
          tagIndex: detail.data.tag - 1,
          region: detail.data.address.split(' '),
          locationString: detail.data.address,
          locationChanged: true,
          detail: detail.data.detail,
          // picked
        });
      }
      // console.log({detail: detail.data})
    }


    
   
  },

  onErrorDown () {
    this.setData({ error: null})
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