// components/popup/coupon.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    coupon: [
      {id: 1, money: 4, limit: 20, expires: '2021.03.06'},
      {id: 2, money: 8, limit: 30, expires: '2021.03.06'},
      {id: 3, money: 12, limit: 50, expires: '2021.03.06'},
      {id: 4, money: 20, limit: 100, expires: '2021.03.06'},
    ]
  },

  

  /**
   * 组件的方法列表
   */
  methods: {
    close () {
      this.triggerEvent('onPopupClose')
    },

    onTapCoupon (e) {
      const {idx} = e.currentTarget.dataset;
      console.log(idx)
    }
  }
})
