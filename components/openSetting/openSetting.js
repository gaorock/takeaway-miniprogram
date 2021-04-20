// components/openSetting/openSetting.js
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

    },
    detached: function () { 

    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close () {
      // this.setData({ open: false });
      this.triggerEvent('confirmSetting', {close: true})
    },

    setup () {
      const that =  this;

      wx.openSetting({
        success (res) {
          console.log(res.authSetting)
          that.triggerEvent('confirmSetting', {permission: {
            userInfo: res.authSetting["scope.userInfo"],
            userLocation: res.authSetting["scope.userLocation"],
          }})
          // res.authSetting = {
          //   "scope.userInfo": true,
          //   "scope.userLocation": true
          // }
        }
      })
    }
  }
})
