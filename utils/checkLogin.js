// const URLs = require('../utils/api');
// const fetch = require('../utils/fetch');

function check_login () {
  const token = wx.getStorageSync('token');
  return token  
}


module.exports = check_login;