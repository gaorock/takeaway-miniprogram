async function check_geoLocation () {
  // check user permission
  return new Promise((resolve, reject) => {
    wx.getSetting({
      async success(res) {
        if (!res.authSetting['scope.userLocation']) {
          console.log('\'scope.userLocation\' no permission.')
          wx.authorize({
            scope: 'scope.userLocation',
            async success () {
              try {
                const location = await getLocation();
                resolve(location)
              }catch(e) {
                reject('getLocation error')
              } 
            },
            fail() {
              reject('declined')
              console.log('declined.')
            }
          })
        } else {
          console.log('\'scope.userLocation\' agreed');
          try {
            const location = await getLocation();
            resolve(location)
          }catch(e) {
            reject('getLocation error')
          }
        }
      },
      fail () {
        reject('getSetting error')
      }
    })
  })
}

async function getLocation () {
  return new Promise ((resolve, reject) => {
    wx.getLocation({
      type: 'wgs84',
      isHighAccuracy: true,
      success (location) {
        resolve(location)
        console.log('agreed.')
      },
      fail () {
        reject('getLocation error')
      }
    })
  })
}

module.exports = {
  check_geoLocation
};