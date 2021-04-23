const formatPrice = require('../../utils/formatPrice');
const login = require('../../utils/login');

// components/bottomCart.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    total: {
      type: Number,
      value: 0
    },
    price: Array,
    deliveryFee: {
      type: Number,
      value: 0
    },
    allowToPay: Boolean,
    closed: {
      type: Boolean,
      value: false
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    cartList: [],
    isCartOpen: false,
    allow: false
  },

  lifetimes: {
    ready () {
      console.log('Cart ready.')
    },
  },

  observers: {
    'isCartOpen': function(isCartOpen) {
      if (!isCartOpen) return;
      const cart = wx.getStorageSync('cart');
      const priceTable = wx.getStorageSync('price');
      const productsTable = wx.getStorageSync('products');

      const cartlist = [];
      let keyindex = 0;

      for(let itemID in cart) {

        if (cart[itemID]['normal'] !== undefined) {
          if (cart[itemID]['normal'] <= 0) continue;
          const item = {};
          item.key = keyindex++;
          item.id= parseInt(itemID);
          item.price = formatPrice(productsTable[itemID].price);
          item.name = productsTable[itemID].post_title;
          item.thumbnail = productsTable[itemID].thumbnail;
          item.tag = productsTable[itemID].tag.map(i => i.name).join(',');
          item.amount = cart[itemID]['normal'];
          item.unit = productsTable[itemID].unit;
          item.multi = false;
          cartlist.push(item)
          
        } else {
          for(let favor in cart[itemID]) {
            if (cart[itemID][favor] <= 0) continue;
            const item = {};
            item.key = keyindex++;
            item.id= parseInt(itemID);
            item.price = formatPrice(priceTable[itemID][favor]);
            item.name = productsTable[itemID].post_title;
            item.thumbnail = productsTable[itemID].thumbnail;
            item.tag = favor;
            item.amount = cart[itemID][favor];
            item.unit = productsTable[itemID].unit;
            item.multi = true;
            cartlist.push(item)
          }
          
        }
      }


      console.log({cartlist})
      this.setData({
        cartList: cartlist,
        priceTable,
        productsTable
      })

    }
  },
 

  /**
   * 组件的方法列表
   */
  methods: {

    // handle user checkout, navigate to 'checkout' page
    async checkout() {
      if (!this.data.allowToPay) return console.log('not enough')

      const token = wx.getStorageSync('token');
      if (this.data.isCartOpen) this.setData({isCartOpen: false});

      if (!token) {
        const loginRes = await login();
        if (loginRes) {
          wx.navigateTo({
            url: '../checkout/checkout',
          })
        }
      }else {
        wx.navigateTo({
          url: '../checkout/checkout',
        })
      }

      
    },

    toggleCart() {
      this.setData({isCartOpen: !this.data.isCartOpen});
    },

    closeCart() {
      this.setData({isCartOpen: false});
    },

    onAmountChange (e) {
      const {id, spec} = e.currentTarget.dataset;
      const { amount } = e.detail;
      // console.log({id, spec, amount})

      const newCartlist = this.data.cartList.map(item => {
        if (item.id === id) {
          if (!item.multi || (item.multi && item.tag === spec)) {
            item.amount = amount
          } 
        }

        return item;
      })


      const total = this.data.cartList.reduce((a ,c) => a + c.amount, 0)
      const price = this.data.cartList.reduce((a ,c) => {
        const iPirce = c.multi?this.data.priceTable[c.id][c.tag]:this.data.productsTable[c.id].price
        return a + parseFloat(iPirce) * c.amount;
      }, 0)
      // console.log({total, price})
      this.setData({cartList: newCartlist})

      this.triggerEvent('cartAmountChange', {total, price, items: newCartlist});
    },

    onClearOutCart () {
      this.triggerEvent('clearoutcart')
    },

  }
})
