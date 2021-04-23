const formatPrice = require('../../utils/formatPrice');
const URLs = require('../../utils/api');
const fetch = require('../../utils/fetch');
const { check_geoLocation } = require('../../utils/checkPermission');
const {isMobilePhone} = require('validator');
// pages/checkout.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,        // 0 delivery | 1 ziqu
    agreeChecked: true, // user protocol aressment checked
    cartList: [],     // cart list items
    checkout: {
      priceStr: '',   // price string for display and data sending
      price: [],      // price array for styled display
      total_price: 0, // initial total price
      youhui: 0,      // youhui: money amount
      deliver_fee: 0, // freight 
    },
    
    bottomHeight: 0,  // adapt iPhone safearea

    // user contact phone for 1/2
    contact: '',  // user name for delivery
    phone: '',  // user phone for delivery AND ziqu

    // 1. delivery (free address)
    address_id: '',  // used for delivery type 1 - and not fixed delivery area

    // 1 delivery (fiexed area)
    area: null, // fixed delivery_area []
    picked_index: null, // fixed delivery_area picked index

    // 2 ziqu/takeaway
    ziqu_time: null,  // user choosen ziqu time
    ziqu_time_index: null,  // ziqu_range idx depend on placing order time
    ziqu_range: [],     // 8:00 - 21:45
    distance: 0,      // server return distance
    shopLocation: '', // server return shop address

    showSetting: false, // open weixin setting, to get permission
    permission: false,  // geoLocation permission

    // remark: '' // this._remark
  },

  // renew from localstorage 
  delivery_type: 3,   //1配送2自取3随意

  async changeTab (e) {
    // lock user tab behaviour if not 3(any)
    if (this.delivery_type !== 3) return;

    const {idx} = e.currentTarget.dataset;
    if (idx === this.data.tabIndex) return;
    this.setData({tabIndex: idx})

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
    // if (this.data.permission) return;

    try {
      // check user permission
      const location = await check_geoLocation();
      console.log(location)
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
      const {kilometre, address, price, total_price, youhui, freight} = settle.data.data;

      this.setData({
        permission: true,
        checkout: {
          priceStr: price,
          price: formatPrice(price),
          total_price,
          youhui,
          deliver_fee: freight
        },
        distance: kilometre,
        shopLocation: address,
      })
    } catch (e) {
      throw Error(e)
    }
  },

  onChangePhone (e) {
    this._ziquContactPhone = e.detail.value;
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

    // get user used phone, for ziqu default phone
    const user_phone = wx.getStorageSync('user_phone') || '';
    const user_name = wx.getStorageSync('user_name') || '';

    console.log({user_phone, user_name})

    if (user_name) {
      console.log('set contact')
      this.setData({contact: user_name});
      this._fixedDeliveryName = user_name;
    }

    if (user_phone) {
      console.log('set contact')
      this.setData({phone: user_phone});
      this._fixedDeliveryPhone = user_phone;
      this._ziquContactPhone = user_phone;
    }

    // render ziqu time range
    let range = [];
    let stop = false;
    let hour_index = 0;
    const hour = new Date().getHours();
    const mini = new Date().getMinutes();
    console.log(hour)
    for (let time = 8; time<22; time++) {
      if (hour < time) {
        hour_index+=4;
      } else if (hour === time && !stop) {
        stop = true;
        const shift = Math.floor(mini / 15)
        hour_index = hour_index - 3 + shift;
      }
      range.push(`${time}:00`);
      range.push(`${time}:15`);
      range.push(`${time}:30`); 
      range.push(`${time}:45`); 
    }

    this.setData({
      ziqu_range: range,
      ziqu_time_index: hour_index
    })



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
            // address_id: 51
          }
        })
        if (res.code === 1) {
          const {total_price, price, youhui, time, freight, address, delivery_area} = res.data.data;

          this._fixedDeliveryName = address?address.contact:this.data.contact;
          this._fixedDeliveryPhone = address?address.phone:this.data.phone;
          console.log(delivery_area)

          this.setData({

            checkout: {
              priceStr: price,
              price: formatPrice(price),  // final price
              total_price,  // before youhui
              youhui,
              time,  // deliver time
              deliver_fee: freight, // deliver fee,
              address: address?address.address:null, // user address
            },
            contact: this._fixedDeliveryName,
            phone: this._fixedDeliveryPhone,
            id: address?address.id:null,
            area: delivery_area
          })
          
          resolve(true)
        }else {
          // 
          this._reSelect = true;
          this.setData({error: '存货不足，请重新选择！'})
          console.warn('code !== 1')
          resolve(false)
        }
        
      } catch(e) {
        console.warn(e)
        resolve(false)
      }
      
    })

  },

  onZiquTimeChange (e) {
    console.log(e)
    this.setData({ziqu_time: this.data.ziqu_range[e.detail.value]});
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
    this._remark = value
  },

  async togopay () {
    // if user choose 'ziqu' but no geoLocation permission, then not allowed to pay
    if (this.data.tabIndex === 1 && !this.data.permission) {
      this.setData({showSetting: true})
      return console.log('no geo_permission');
    }
    
    const type = this.data.tabIndex + 1;
    const {checkout} = this.data;

    const data = {
      remark: this._remark || '',
      freight: checkout?checkout.deliver_fee: 0,
      youhui: checkout?checkout.youhui: 0,
      price: checkout?checkout.priceStr: 0,
      type,
      goods: this._requestList || []
    }

    if (type === 2) {
      
      const date = new Date();
      data['ziqu_time'] = this.data.ziqu_time === null?date.getHours() + ':' + date.getMinutes():this.data.ziqu_time;
      if (!isMobilePhone(this._ziquContactPhone.toString(), 'zh-CN')) {
        return this.setData({error: '电话格式错误！'})
      }
      data['mobile'] = this._ziquContactPhone
      wx.setStorageSync('user_phone', this._ziquContactPhone)

    } else {
      // type === 1 and  
      if (this.data.area) {
        if (this.data.picked_index) {
          if (!this._fixedDeliveryName) return this.setData({error: '请填写联系人姓名'});
          if (this._fixedDeliveryName.length > 10) return this.setData({error: '姓名长度超出最大范围'});
          if (!this._fixedDeliveryPhone) return this.setData({error: '请填写联系人电话'});
          if (!isMobilePhone(this._fixedDeliveryPhone.toString(), 'zh-CN')) return this.setData({error: '电话格式不正确'});
          
          data['area'] = this.data.area[this.data.picked_index];
          data['contact'] = this._fixedDeliveryName;
          data['mobile'] = this._fixedDeliveryPhone;
          wx.setStorageSync('user_name', this._fixedDeliveryName)
          wx.setStorageSync('user_phone', this._fixedDeliveryPhone)
        } else {
          return this.setData({error: '请选择配送区域'})
        }
      } else {
        data['address_id'] = this.data.id
      }
    }



    try {
      const orderRes = await fetch(URLs.postAddOrder, {
        method: 'POST',
        data
      })

      if (orderRes.code === 1) {
        // order_id
        // wx.setStorageSync('order_id', orderRes.data);
        wx.redirectTo({
          url: `/pages/pay/pay?order_id=${orderRes.data}&money=${checkout.priceStr}`
        })

      } else {
        console.warn(orderRes.msg)
      }

    } catch(e) {
      console.warn(e)
    }

  },


  /**
   * Case: delivery_type = 1|3, fixed delivery area is defined 
   */
  onAreaChange (e) {
    this.setData({picked_index: e.detail.value})
  },

  onFixedDeliveryNameChange(e) {
    this._fixedDeliveryName = e.detail.value;
  },

  onFixedDeliveryPhoneChange(e) {
    this._fixedDeliveryPhone = e.detail.value;
  },

  onErrorDown () {
    this.setData({error: null})
    if (this._reSelect) {
      this._reSelect = false;
      wx.navigateBack({
        delta: 1,
        fail () {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      })
    }
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
    try {
      // load 'delivery_type': 1配送2自取3随意
      const delivery_type = wx.getStorageSync('delivery_type');
      this.setData({delivery_type})
      // deliver
      if (delivery_type === 2) {
        this.setData({tabIndex: 1})
        try{
          await this._getUserLocation()
        } catch(e) {
          // get permission to use geoLocation
          console.error(e)
          this.setData({showSetting: true, permission: false})
        }
        
      } else {
        // default tab 1
        await this._requestSettle();
      }
    } catch(e) {  

      console.warn(e)

    }
    

    


    
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