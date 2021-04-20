const formatPrice = require('../../utils/formatPrice');
const URLs = require('../../utils/api');
const fetch = require('../../utils/fetch');
const { check_geoLocation } = require('../../utils/checkPermission');
// pages/checkout.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    agreeChecked: true,
    cartList: [],
    checkout: {
      price: 0,
      total_price: 0,
      youhui: 0,
      deliver_fee: 0,
    },
    
    bottomHeight: 0,

    // user contact phone for 1/2
    contact: '',
    phone: '',
    address_id: '',

    // 1 takeaway
    distance: 0,
    shopLocation: '',

    showSetting: false,
    permission: false,

    remark: ''
  },

  async changeTab (e) {
    const {idx} = e.currentTarget.dataset;
    const that = this;
    // user choose takeaway
    if (idx === 1) {
      try{
        await this._getUserLocation()
      } catch(e) {
        // get permission to use geoLocation
        console.error(e)
        that.setData({showSetting: true, permission: false})
      }
    } else {
      // user choose delivery
      const data = await this._requestSettle();
      console.log(data)
    }

    this.setData({tabIndex: idx})
  },

  // on Tab2, if no permission, check to show setting button
  showSetting () {
    this.setData({showSetting: true})
  }, 

  // invoked when user comfirmed setting, can be doing nothing.
  async onConfirmSetting (e) {
    const { permission, close } = e.detail;
    console.log({permission, close})
    if (close) return this.setData({showSetting: false});
    if (permission.userLocation) {
      try {
        await this._getUserLocation();
        this.setData({showSetting: false})
      } catch(e) {

      }
    }
  },

  changeAgree () {
    this.setData({ agreeChecked: !this.data.agreeChecked})
  },


  // invoke 'check_geoLocation' to check permission
  // get shop address and distance
  async _getUserLocation () {
    if (this.data.permission) return;

    try {
      // check user permission
      const location = await check_geoLocation();
      const data = {
        type: 2,
        goods: this._requestList,
        lng: location.longitude,
        lat: location.latitude,
      }
      console.log({location, data})

      // get shop data
      const settle = await fetch(URLs.postSettleOrder, {
        method: 'POST',
        data,
      })

      console.log(settle)
      const {kilometre, address, price, total_price, youhui} = settle.data.data;

      this.setData({
        permission: true,
        checkout: {
          price,
          total_price,
          youhui
        },
        distance: kilometre,
        shopLocation: address,
      })
    } catch (e) {
      throw Error(e)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // get system info
    const sys = wx.getSystemInfoSync();
    console.log(sys)
    this.setData({bottomHeight: sys.screenHeight - sys.safeArea.bottom})
    

    // read Cart list form localstorage
    const cart = wx.getStorageSync('cart');
    this._priceTable = wx.getStorageSync('price');
    this._productsTable = wx.getStorageSync('products');
    this._subidTable = wx.getStorageSync('subid');
    this._requestList = [];

    if (cart) {
      const cartList = this._construct_cart(cart);
      this._requestList = cartList.map(item => {
        const id = item.id;
        const num = item.amount;

        const output = item.multi? {
          id, subid: this._subidTable[id][item.tag], num
        }: {id, num}
        return output
      })

      this.setData({cartList});
    }
    
  },

  async _requestSettle () {
    
    return new Promise(async (resolve, reject) => {
      try {
        // get coupon info from server
        const res = await fetch(URLs.postSettleOrder, {
          method: 'POST',
          data: {
            type: 1,
            goods: this._requestList,
            address_id: 51
          }
        })
        if (res.code === 1) {
          const {total_price, price, youhui, time, freight, address} = res.data.data;
          this.setData({

            checkout: {
              price: formatPrice(price),  // final price
              total_price,  // before youhui
              youhui,
              time,  // deliver time
              deliver_fee: freight, // deliver fee,
              address: address?address.address:null, // user address
            },
            contact: address?address.contact:null,
            phone: address?address.phone:null,
            id: address?address.id:null
          })
          
          resolve(true)
        }else {
          console.warn('code !== 1')
          resolve(false)
        }
        
      } catch(e) {
        console.warn(e)
        resolve(false)
      }
      
    })

  },

  _construct_cart (cart) {
    const cartlist = [];
    let keyindex = 0;

    for(let itemID in cart) {
      if (cart[itemID]['normal'] !== undefined) {
        if (cart[itemID]['normal'] <= 0) continue;
        const item = {};
        item.key = keyindex++;
        item.id= parseInt(itemID);
        item.price = formatPrice(this._productsTable[itemID].price);
        item.name = this._productsTable[itemID].post_title;
        item.thumbnail = this._productsTable[itemID].thumbnail;
        item.tag = this._productsTable[itemID].tag.map(i => i.name).join(',');
        item.amount = cart[itemID]['normal'];
        item.unit = this._productsTable[itemID].unit;
        item.multi = false;
        cartlist.push(item)
        
      } else {
        for(let favor in cart[itemID]) {
          if (cart[itemID][favor] <= 0) continue;
          const item = {};
          item.key = keyindex++;
          item.id= parseInt(itemID);
          item.price = formatPrice(this._priceTable[itemID][favor]);
          item.name = this._productsTable[itemID].post_title;
          item.thumbnail = this._productsTable[itemID].thumbnail;
          item.tag = favor;
          item.amount = cart[itemID][favor];
          item.unit = this._productsTable[itemID].unit;
          item.multi = true;
          cartlist.push(item)
        }
        
      }
    }

    return cartlist;
  },

  onMemoChange (e) {
    const {value} = e.detail;
    this.setData({remark: value})
  },

  async togopay () {

    const type = this.data.tabIndex + 1;

    const data = {
      remark: '',
      freight: 0,
      youhui: 10,
      price: 20,
      man_price: 0,
      type,
      goods: this._requestList || []
    }



    if (type === 2) {
      data['ziqu_time'] = 'xxxx-xx-xx'
      data['mobile'] = '12345678910'
    } else {
      data['address_id'] = this.data.id
    }

    const orderRes = await fetch(URLs.postAddOrder, {
      method: 'POST',
      data
    })

    console.log(data)

    console.log(orderRes)
    // wx.navigateTo({
    //   url: `../pay/pay?money=${this.data.checkout.price.join('.')}`,
    // })
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
    // default tab 1
    await this._requestSettle();
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