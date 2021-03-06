const login = require('../../utils/login');
const URLs = require('../../utils/api');
const fetch = require('../../utils/fetch');

// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    list: [],
    login: false,
    inform: null,
    
    status: ['待发货', '已发货', '已完成', '退款中', '已退款']
  },

  changeTab (e) {
    const { index } = e.currentTarget.dataset;
    console.log({index})
    
    if (index !== this.data.tabIndex) {
      this._lastpage = false;
      this._currentPage = 1;

      this.setData({
        tabIndex: index,
        list: []
      });

      this._getOrderList(index)
    }
  },

  // template Event
  navigate (e) {
    const { id, status, commented } = e.currentTarget.dataset;
    const code = parseInt(status.value);
    // ignore 1待发货 6已退款
    
    // if (code !== 2 && code !==3 && code !== 5 ) return; 
    // if (code === 3 && commented) return; // 已完成/已评价

    console.log({id, status: code})
    wx.navigateTo({
      url: `../orderDetail/orderDetail?id=${id}&type=${code}`
    })
  },

  goHome () {
    console.log('gohome')
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  async login () {
    const res = await login();
    console.log(res);
    if (res) {
      this.setData({login: true})
      this._getOrderList(this.data.tabIndex);
    }
  },

  toEvaluate(e) {
    const {id} = e.currentTarget.dataset;
    console.log({id})

    const currentOrder = this.data.list.filter(o => o.id === id);
    if (currentOrder[0]) wx.setStorageSync('orderToBeEvaluated', currentOrder[0])
    console.log({currentOrder})
    wx.navigateTo({
      url: `/pages/evaluate/evaluate?id=${id}`
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    if (options.page) this.setData({tabIndex: parseInt(options.page)})
  },

  onShow: function () {
    console.log('show')
    const token = wx.getStorageSync('token');
    this.setData({login: !!token});
    this._currentPage = 1;
    this._getOrderList(this.data.tabIndex, true);
  },

  async _getOrderList (status, reload) {
    let oldList = this.data.list;

    if (reload) {
      this._lastpage = false;
      this._currentPage = 1;
      oldList = [];
    }
    if (this._lastpage) return;
    const ref = [1, 4, 5]
    
    const order = await fetch(URLs.getOrderList, {
      method: 'POST',
      data: {
        page_num: this._currentPage,
        status: ref[status]
      }
    });
    
    let data = order.data
    if (order.code !== 1) return
    if (order.data.length === 0) return this._lastpage = true;
    if (status === 1) { 
      data = order.data.filter(o => o.is_comments === 0)
    }

    this._currentPage++;
    this.setData({
      list: [...oldList, ...data],
    })
  },


  async toCancel (e) {
    const { id } = e.currentTarget.dataset;
    console.log({id})
    const res = await fetch(URLs.postOrderRefund, {
      method: 'POST',
      data: {
        id
      }
    })
    if (res.code === 1) this.setData({inform: '取消订单成功！'})

    console.log(res)
  },

  async toConfirm (e) {
    const { id } = e.currentTarget.dataset;
    console.log({id})
    const res = await fetch(URLs.receiveOrder, {
      method: 'POST',
      data: {id}
    })
    if (res.code === 1) this.setData({inform: '确认收货成功！'})
    console.log(res)
    
  },

  async toPay (e) {
    const { id } = e.currentTarget.dataset;
    console.log('to pay', id)
    wx.navigateTo({
      url: '/pages/pay/pay?order_id='+id
    })
  },

  onMsgDown() {
    this.setData({inform: null})
    this._getOrderList(this.data.tabIndex, true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('bottom')
    this._getOrderList(this.data.tabIndex);
  },

})