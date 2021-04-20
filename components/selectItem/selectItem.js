const {
  getMultiSpecProductUrl,
  getMultiSpecProductPriceUrl,
} = require('../../utils/api');
const fetch = require('../../utils/fetch');

// components/selectItem/selectItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    xid: Number,
  },

  lifetimes: {
     attached: async function() {
      console.log({xid: this.data.xid})

      const res = await fetch(`${getMultiSpecProductUrl}?id=${this.data.xid}`);

      if (res.code === 1) {
        // initial option select state
        // like -> [[optIndex, selected], [optIndex, selected] ...]
        const tempCateArray = [];
        res.data.param.forEach(cate => {
          const optArr = [];
          cate.param.forEach(opt => {
            optArr.push([opt.param, !!(~opt.selected)])
          })
          tempCateArray.push(optArr);
        });

        // initialize select string
        const selectedString = this._flat_opt(tempCateArray);

        // get 'cart' information from localStorage
        const cartLocal = wx.getStorageSync('cart');

        /** cartLocal
         * {
         *    '1' : {
         *          '红豆,常温,常规糖': 2,
         *          '升级牛奶茶,去冰,不加糖': 1
         *        },
         *    '3' : {
         *          '...': 1
         *          '...': 5
         *        }
         * }
         */
        let chooseToSave = {}, amount = 0;

        // if this 'id' exists, restore info to the component state 'chooseToSave'
        if (cartLocal && cartLocal[this.data.xid]) {
          // console.log(cartLocal[this.data.xid])
          chooseToSave = cartLocal[this.data.xid]
        }

        // if default combination has been selected before, then restore 'amount'
        if (chooseToSave[selectedString]) {
          amount = chooseToSave[selectedString];
          // console.log(amount)
        }
        
        this.setData({
          product: {
            title: res.data.post_title,
            ...res.data.arr,
            price: this._format_price(res.data.arr.price),
          },
          multiChoose: res.data.param,
          // [[optIndex, selected], [optIndex, selected] ...]
          choosenArray: tempCateArray,
          selectedString,
          chooseToSave: chooseToSave,
          amount: amount,
          subid: res.data.arr.id // add combination ID as 'sub ID'
        })
      }
        
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      // console.log('select detached.',{data: this.data})
    },

    ready() {


      // console.log('select ready.',{data: this.data})
      // console.log({xid: this.data.xid, item: this.data.item})
    }
  },

  

  /**
   * 组件的初始数据
   */
  data: {
    product: null,  // 
    multiChoose: [],
    choosenArray: [],

    chooseToSave: {},
    selectedString: '',
    amount: 0,
    subid: null
    // price: [0, 0],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _flat_opt (arr) {
      const optArray = arr.map(c => {
        const newC = c.filter(i => i[1])
        return newC[0][0];
      })
      return optArray.join(',')
    },

    _format_price (price) {
      return price.split('.');
    },


    closeSelect () {
      this.triggerEvent('closeSelect')
    },

    onAmountChange (e) {
      const { amount } = e.detail;
      this.setData({amount});
    },

    async tapOption (e) {
      // only get cateIndex & optIndex to alter select state
      const {cateindex, optindex} = e.currentTarget.dataset;
      
      // 1.
      const tempCateArray = this.data.choosenArray;
      // 2.
      const newArray = tempCateArray[cateindex].map((opt, index) => {
        if (index === optindex) opt[1] = true;
        else opt[1] = false;

        return opt
      })
      // 3. set newArray to corresponding item in Main Array
      tempCateArray[cateindex] = newArray;
      const selectedString = this._flat_opt(tempCateArray);

      // when tap on options, init choosen 'amount' for this combination
      // if combination exists, set 'amount'
      const amount = this.data.chooseToSave[selectedString] || 0;

      
 

      // get available 'price' and 'stock' form server,
      // const url = 'https://waimai.douxiaoxu.com/api/home/index/param_price?';
      const url = getMultiSpecProductPriceUrl + '?';
      const data = [`id=${this.data.xid}`]
  
      const params = selectedString.split(',');
      params.forEach((i, idx) => {
        data.push(`param${idx+1}=${i}`) 
      })


      const res = await fetch(url + data.join('&'));


      if (res.code === 1) {
        const product = {
          ...this.data.product,
          stock: res.data.stock,
          price: this._format_price(res.data.price)
        }
        this.setData({
          choosenArray: tempCateArray, 
          selectedString, 
          amount, 
          product, 
          subid: res.data.id // add combination ID as 'sub ID'
        })
      }


      

      
    },

    onSubmit (e) {
      const { disabled } = e.currentTarget.dataset;
      if (disabled) return;

      // need fix
      this.triggerEvent('submitSelect', {
        id: this.data.xid,
        selected: this.data.selectedString,
        amount: this.data.amount,
        price: parseFloat(this.data.product.price.join('.')),
        subid: this.data.subid
      })
    }
    
  }
})
