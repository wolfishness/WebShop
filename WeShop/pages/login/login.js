const App = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sign: false,
    logged: !1
  }
  ,
  onLoad() { },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow() {
    const token = App.WxService.getStorageSync('token')
    this.setData({
      logged: !!token
    })
    token && setTimeout(this.goIndex, 1500)
  },
  goIndex() {
    App.WxService.switchTab('/pages/index/index')
  },
  onGotUserInfo(e) {
    //console.log(e.detail.errMsg)
    //console.log(e.detail.userInfo)
    //console.log(e.detail.rawData)
    //console.log(e.detail.encryptedData)
    wx.login({
      success: function (res) {
        var code = res.code;//登录凭证
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            success: function (res_user) {
              console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
              wx.request({
                url: 'http://localhost:8443/member/autoLogin',//自己的服务接口地址
                method: 'POST',
                header: {
                  "Content-Type": "application/json"
                },
                data: {
                  code: res.code,//获取openid的话 需要向后台传递code,利用code请求api获取openid
                  headImgUrl: res_user.userInfo.avatarUrl,//这些是用户的基本信息
                  name: res_user.userInfo.nickName,//获取昵称
                  sex: res_user.userInfo.gender,//获取性别
                  country: res_user.userInfo.country,//获取国家
                  province: res_user.userInfo.province,//获取省份
                  city: res_user.userInfo.city//获取城市
                   },
                success: function (data) {
                  
                  console.log(data)
                  //4.解密成功后 获取自己服务器返回的结果
                  if (data.data.status == 1) {
                    var userInfo_ = data.data.userInfo;
                    console.log(userInfo_);
                    
                  } else {
                    console.log('解密失败')
                  }
                  App.WxService.setStorageSync('token', data.data.token)
                  App.WxService.switchTab('/pages/index/index')
                },
                fail: function () {
                  console.log('系统错误')
                }
              })
            },
            fail: function () {
              console.log('获取用户信息失败')
            }
          })
        } else {
          console.log('获取用户登录态失败！' + r.errMsg)
        }
      },
      fail: function () {
        console.log('登陆失败')
      }
    })
  },
})