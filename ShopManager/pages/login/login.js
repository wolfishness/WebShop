const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    token: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sign: false,
    logged: !1,
    defaultURL:""
  },
  onLoad() {
    var defaultURL = app.globalData.defaultURL

    this.setData({
      defaultURL: defaultURL
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const token = wx.getStorageSync('token')
    this.setData({
      logged: !!token
    })
    console.log(token)
    token && setTimeout(this.goIndex, 1500)
  },
  goIndex() {
    console.log("in here")
    var permission = wx.getStorageSync("pId")
    if(permission != 2){
      wx.switchTab({
        //url: '/pages/search/search',
        url: "/pages/classify/classify",
        success: function () {
          console.log('yes')
        },
        fail: function () {
          console.log('no')
        }
      })
    }else{
      wx.navigateTo({
        url:  `/pages/shopOrder/shopOrder?id=${10}`,
      })
    }
    
  },
  onGotUserInfo(e) {
    var that = this
    wx.login({
      success: function(res) {
        var code = res.code; //登录凭证
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            success: function(res_user) {
              console.log({
                encryptedData: res.encryptedData,
                iv: res.iv,
                code: code
              })
              wx.setStorageSync("userInfo", res_user.userInfo)
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
              wx.request({
                url: `${app.globalData.defaultURL}/member/autoLogin`, //自己的服务接口地址
                method: 'POST',
                header: {
                  "Content-Type": "application/json"
                },
                data: {
                  code: res.code, //获取openid的话 需要向后台传递code,利用code请求api获取openid
                  headImgUrl: res_user.userInfo.avatarUrl, //这些是用户的基本信息
                  name: res_user.userInfo.nickName, //获取昵称
                  sex: res_user.userInfo.gender, //获取性别
                  country: res_user.userInfo.country, //获取国家
                  province: res_user.userInfo.province, //获取省份
                  city: res_user.userInfo.city //获取城市
                },
                success: function(data) {

                  console.log(data)
                  //4.解密成功后 获取自己服务器返回的结果
                  if (data.data.status == 1) {
                    var userInfo_ = data.data.userInfo;
                    console.log(userInfo_);

                  } else {
                    console.log('解密失败')
                  }
                  wx.setStorageSync('token', data.data.token)
                  wx.setStorageSync('id', data.data.userInfo.id)
                  wx.setStorageSync('pId', data.data.permissionsId)
                  //权限判断
                  if (data.data.userInfo.permissionsId == 1){
                    that.goIndex()
                  }else{
                    wx.switchTab({
                      url: '/pages/shopOrder/shopOrder',
                      success: function () {
                        console.log('yes')
                      },
                      fail: function () {
                        console.log('no')
                      }
                    })
                  }
                  
                  //wx.switchTab('/pages/index/index')
                },
                fail: function() {
                  console.log('系统错误')
                }
              })
            },
            fail: function() {
              console.log('获取用户信息失败')
            }
          })
        } else {
          console.log('获取用户登录态失败！' + r.errMsg)
        }
      },
      fail: function() {
        console.log('登陆失败')
      }
    })
  },
})