// components/menu/menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    cartItem: Object,
    catelist: Array,
    products: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    menuID: 0,  // stores left menu active index
  },

  lifetimes: {
    ready: function () {
      console.log('menu ready.', {products: this.data.products})

      // initial left menu index with first id.
      this.setData({menuID: this.data.catelist[0].id})

      // console.log('menu ready.', {cartItem: this.data.cartItem, catelist: this.data.catelist, products: this.data.products})
      
      // store a value indicates if user clicked the 'Left menu' button
      this._isMenuClick = false;
  
      this.createSelectorQuery().selectAll('.right-cate-bar').node(boxes => {
        this._menuIndex = []; // store menu index in order to track current menu id
  
        boxes.forEach((box, index) => {
          const id = this.data.products[index].id;  // left menu id
          this._menuIndex.push(id)
  
          const observer = this.createIntersectionObserver();
          
          observer.relativeTo('.right-menu').observe(`.cate${id}`, res => {
            // console.log(res)
            // if user click disable observer logic
            if (this._isMenuClick) return;
            // if box into view
            if (res.intersectionRatio > 0) {
              this.setData({menuID: id})
            // if box out of view
            } else {
              // use the last index as current index to set ID
              this.setData({menuID: this._menuIndex[index - 1]})
            }
          });
        });
      }).exec();
  
    },

    // attached: function () {
    //   console.log('menu attached.', {products: this.data.products})
    // }
  },


  /**
   * 组件的方法列表
   */
  methods: {
    changeMenuIndex (e) {
      const { id } = e.currentTarget.dataset;
      // console.log(id)
      // set user click to TRUE in 'tap' Event
      this._isMenuClick = true;
      this.setData({rightViewIndex: 'cate'+id, menuID: id});
    },

    // addToCart(e) {
    //   const {id, spec} = e.currentTarget.dataset;
    //   this.triggerEvent('addToCart', {id, spec})
    // },

    // subToCart(e) {
    //   const {id, spec} = e.currentTarget.dataset;
    //   this.triggerEvent('subToCart', {id, spec})
    // },
    
    onRightScroll (e) {
      // listen to 'scroll' Event, it fires when scroll stops
      // then set user click to FALSE
      // so that observer can do its thing
      this._isMenuClick = false;
    },

    onAmountChange(e) {
      const {id, spec} = e.currentTarget.dataset;
      const { amount } = e.detail;
      this.triggerEvent('amountChange', {id, spec, amount});
    },
    
    openMultiSelect (e) {
      const {id} = e.currentTarget.dataset;
      this.triggerEvent('openMultiSelect', {id});
    },

  }
})
