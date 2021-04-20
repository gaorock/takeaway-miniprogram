/**
 * To Be Implemented !!!!!!!!!!!!!!!!!!!!!
 * @param {Float} money 
 * @param {Array} items
 * @param {Boolean} coupon
 * @returns Promise
 */


function requestPayment ({money, items, coupon}) {
  if (!money || !items || !items instanceof Array || items.length === 0 || !coupon) return console.warn('requestPayment arguments error.');
  const url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi';

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method: 'POST',
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