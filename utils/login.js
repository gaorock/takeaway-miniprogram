const URLs = require('../utils/api');
const fetch = require('../utils/fetch');

async function login () {
  // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗

  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '用于会员快捷登陆', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        
        console.log({res})
        wx.login({
           async success (loginRes) {
            console.log('login ok')
            if (loginRes.code) {
              //发起网络请求
              console.log('login ok', {code: loginRes.code})
    
              const token = await getOpenID({
                code: loginRes.code, 
                appid: 'wxc953033086b6b2b7', 
                signature: res.signature, 
                encryptedData: res.encryptedData, 
                iv: res.iv, 
                raw_data: res.userInfo, 
                user_type: 2
              })

              if (token) {
                resolve(token)
              } else {
                resolve(false)
              }
            } else {
              console.log('登录失败！' + res.errMsg);
              resolve(false)
            }
          }
        })
      },
      fail () {
        console.warn('getUserProfile fail.')
        resolve(false)
      }
    })
  })
    
}

async function getOpenID ({code, appid, signature, encryptedData, iv, raw_data, user_type}) {

  return new Promise(async (resolve, reject) => {

    try {
      const response = await fetch(URLs.getOpenID, {
        method: 'POST',
        data: {code, appid, signature, encryptedData, iv, raw_data, user_type}
      });
      if (response.code === 1) {
        wx.setStorageSync('token', response.data.token);
        console.log({response});
        resolve(response.data.token)
      }
      
    } catch(e) {
      console.warn(e);
      resolve(false)
    }
    
  })
  
}

module.exports = login;