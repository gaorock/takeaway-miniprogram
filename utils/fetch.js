function fetch (url, option = {}) {

  const token = wx.getStorageSync('token');

  const defaultOpt = {
    method: option.method || 'GET',
    data: option.data || {},
    headers: {
      "Cache-Control": "no-cache",
      'XX-Api-Version': '1.0',
      'XX-Byte-AppId': 'wxc953033086b6b2b7',
      'XX-Device-Type': 'wx',
      'XX-Token': token
    }
  }

  if (!wx || !wx.request) return console.warn('not Weixin env.');

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method: defaultOpt.method,
      header: defaultOpt.headers,
      data: defaultOpt.data,
      success: (e) => {
        resolve(e.data)
      },
      fail: (e) => {
        reject('fail')
      },
      complete: (e) => {
        resolve('complete')
      }
    })
  })

}

module.exports = fetch