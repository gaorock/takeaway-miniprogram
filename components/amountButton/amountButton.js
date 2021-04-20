// components/amountButton/amountButton.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    amount: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    add () {
      const change = this.data.amount + 1;
      this.triggerEvent('amountChange', {amount: change});
    },

    sub () {
      if (this.data.amount <= 0) return;
      const change = this.data.amount - 1;
      this.triggerEvent('amountChange', {amount: change});
    }
  }
})
