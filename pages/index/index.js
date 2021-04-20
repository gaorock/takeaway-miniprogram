// index.js

// 获取应用实例
const app = getApp();
const fetch = require('../../utils/fetch');
const formatData = require('../../utils/formatData');
const {
  getHomeDataUrl,
  getCommitsUrl
} = require('../../utils/api');

Page({
  data: {
    loading: true,
    topImage: '/assets/images/home-top.png',
    cartItem: {}, // stores shopping cart info
    shop: {},     // for render home page's shop info. logo, name etc.
    catelist: [], // for render home left menu list
    products: [], // for render home right pruducts list
    coupon: [],   // for render home top 'coupon' section 


    cartTotal: 0,       // total amount to display at bottom cart bar
    priceTotal: [],     // total price to display at bottom cart bar
    
    showMultiID: null,  // state for render multi select ID or null

    tabIndex: 0,        // state for render menu tab or commit tab
    totalCommits: 0,    // state for render commits number at tab bar

    popup: false,        // home page, coupon popup

  },


  setOrderActive() {
    this.setData({tabIndex: 0})
  },

  setCommitActive () {
    this.setData({tabIndex: 1})
  }, 

  onPopupClose () {
    this.setData({popup: false})
  },

  /** cartItem
   * {
   *    'id1': {
   *        'normal': 1,
   *        'multi': {
   *          
   *        
   *        }
   *    },
   *    'id2': {
   *        'multi': 5
   *    },
   * }
   * 
   */

  onAmountChange(e) {
    // console.log('onAmountChange - index');

    const temp = this.data.cartItem;
    const {id, spec, amount} = e.detail; // id - product ID, spec - 'normal'

    if (temp[id]) {
      temp[id][spec] = amount;
    } else {
      temp[id] = {
        [spec]: amount
      }
    }

    // calculate total 
    let total = 0, price = 0;
    for(let itemID in temp) {
      for(let itemSpec in temp[itemID]) {
        total+=temp[itemID][itemSpec];
        // calculate price based on combination
        const subPrice = this._priceTable[itemID]?this._priceTable[itemID][itemSpec]:this._find_price(itemID);
        price+=(subPrice*temp[itemID][itemSpec])
      }
    }
    // format 'price'
    const formatedPrice = String(price).split('.')

    this.setData({cartItem: temp, cartTotal: total, priceTotal: this._format_price(price)});
    wx.setStorageSync('cart', temp)
  },

  onCartAmountChange (e) {
    const { total, price, items } = e.detail;
    // console.log({total, price, items});

    const cartItemToUpdate  = {};
    items.forEach(i => {
      if (this.data.cartItem[i.id]) {
        cartItemToUpdate[i.id] = {};
        if (!i.multi) cartItemToUpdate[i.id]['normal'] = i.amount;
        else cartItemToUpdate[i.id][i.tag] = i.amount;
      }
    });

    // console.log(cartItemToUpdate)

    this.setData({cartTotal: total, priceTotal: this._format_price(price), cartItem: cartItemToUpdate})
    wx.setStorageSync('cart', cartItemToUpdate)
  },

  onClearOutCart () {
    // console.log('onClearOutCart');
    this.setData({cartTotal: 0, priceTotal: 0, cartItem: {}})
    wx.removeStorageSync('cart')
  },

  onCloseSelect() {
    this.setData({showMultiID: null})
  },

  onOpenMultiSelect (e) {
    const {id} = e.detail;
    // console.log('onOpenMultiSelect', {id})
    this.setData({showMultiID: id})
  },

  onSubmitSelect(e) {
    const {id, selected, amount, price, subid} = e.detail;
    // console.log('onSubmitSelect', {id, selected, amount, price, subid});

    const temp = this.data.cartItem;
    // add to cart
    if (temp[id]) {
      temp[id][selected] = amount
    } else {
      temp[id] = {
        [selected]: amount
      }
    }

    // update price table 
    if (this._priceTable && this._priceTable[id]) {
      if (!this._priceTable[id][selected]) {
        this._priceTable[id][selected] = price
      }
    } else {
      this._priceTable[id] = {
        [selected]: price
      }
    }

    // update subid table 
    if (this._subidTable && this._subidTable[id]) {
      if (!this._subidTable[id][selected]) {
        this._subidTable[id][selected] = subid
      }
    } else {
      this._subidTable[id] = {
        [selected]: subid
      }
    }


    wx.setStorageSync('price', this._priceTable);
    wx.setStorageSync('subid', this._subidTable);



    // calculate total 
    let total = 0, totalprice = 0;
    for(let itemID in temp) {
      for(let itemSpec in temp[itemID]) {
        total+=temp[itemID][itemSpec];
        // calculate price based on combination
        const subPrice = this._priceTable[itemID]?this._priceTable[itemID][itemSpec]:this._find_price(itemID);
        totalprice+=(subPrice*temp[itemID][itemSpec])
      }
    }

    this.setData({cartItem: temp, cartTotal: total, priceTotal: this._format_price(totalprice), showMultiID: null});
    wx.setStorageSync('cart', temp);
    
    
  },

  async onLoad () {
    if (!this.data.loading) this.setData({loading: true});
    const res = await fetch(getHomeDataUrl);

    if (res.code !== 1) return console.warn('internet request fail.')
    
    const json = formatData(res.data);
    
    console.log(json)

    // save a copy for cart detail list
    wx.setStorageSync('products', json.productsTable);

    this.setData({
      shop: json.shop,
      products: json.products,
      catelist: json.cate,
      coupon: json.coupon
    })

    

    // setup a price table for multi spec, and 'subid's
    const _priceTable = wx.getStorageSync('price');
    const _subidTable = wx.getStorageSync('subid');
    this._priceTable = _priceTable || {};
    this._subidTable = _subidTable || {};
    
    this._init_cart(); 


    // fetch commits data from server, just get total commits number
    const commits = await fetch(`${getCommitsUrl}?page=1`);
    if (commits.code === 1) {
      this.setData({ totalCommits: commits.data.total})
    }

    setTimeout(() => {
      this.setData({loading: false});
    }, 200)
  },


  _init_cart () {
     // initialize Cart from local storage
     const cartItem = wx.getStorageSync('cart');

     if (cartItem && Object.keys(cartItem).length > 0) {
        // calculate total 
        let total = 0, price = 0;
        for(let itemID in cartItem) {
          for(let itemSpec in cartItem[itemID]) {
            total+=cartItem[itemID][itemSpec];
            // calculate price based on combination
            const subPrice = this._priceTable[itemID]?this._priceTable[itemID][itemSpec]:this._find_price(itemID);
            price+=(subPrice*cartItem[itemID][itemSpec])
          }
        }

        this.setData({cartItem: cartItem, cartTotal: total, priceTotal: this._format_price(price)});
     }    
  },


  // find price for 'normal' item
  _find_price (id) {
    let price;
    for(let el of this.data.products) {
      for(let item of el.goods) {
        if (item.id === Number(id)) {
          return parseFloat(item.price)
        }
      }
    }
  },

  _format_price (price) {
    const formatedPrice = String(price.toFixed(2)).split('.')
    if (formatedPrice[1]) {
      formatedPrice[1] = formatedPrice[1].length >= 2?formatedPrice[1]:formatedPrice[1]+'0';
    } else {
      formatedPrice[1] = '00'
    }

    return formatedPrice

  },
})
