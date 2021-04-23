// components/error/error.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    message: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    open: true
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { 
      this._timer = setTimeout(() => {
        this.setData({ open: false });
      }, 2000)
    },
    detached: function () { 
      clearTimeout(this._timer);
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close () {
      this.setData({ open: false });
      this.triggerEvent('onMsgDown');
      this.triggerEvent('onErrorDown');
    },

    onTransitionEnd () {
      this.triggerEvent('onMsgDown');
      this.triggerEvent('onErrorDown');
    }
  }
})
