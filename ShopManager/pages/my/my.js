//index.js
//获取应用实例
var app = getApp()
var app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderItems: [
      {
        typeId: 10,
        name: '全部',
        url: 'bill',
        imageurl: '../../image/person/all0.png',
      },
      {
        typeId: 0,
        name: '待付款',
        url: 'bill',
        imageurl: '../../image/person/unPay0.png',
      },
      {
        typeId: 2,
        name: '待发货',
        url: 'bill',
        imageurl: '../../image/person/unSend0.png',
      },
      {
        typeId: 3,
        name: '待收货',
        url: 'bill',
        imageurl: '../../image/person/unReceive0.png',
      },
      {
        typeId: 9,
        name: '退换货',
        url: 'bill',
        imageurl: '../../image/person/refund0.png',
      }
    ],
  },
  //事件处理函数
  toOrder: function() {
    wx.navigateTo({
      url: `/pages/shopOrder/shopOrder?id=${this.data.cartList[index].goodsId}`
    })
  },
  onLoad: function() {
    var that = this
    //调用应用实例的方法获取全局数据
    let userInfo = wx.getStorageSync("userInfo");
    //更新数据
    that.setData({
      userInfo: userInfo
    })
  },
  selectType({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    wx.navigateTo({
      url: `/pages/shopOrder/shopOrder?id=${this.data.orderItems[index].typeId}`
    })
  },

  toOrder(){
    wx.navigateTo({
      url: `/pages/shopOrder/shopOrder?id=${10}`
    })
  }
  , findAfter(){
    wx.navigateTo({
      url: `/pages/shopOrder/shopOrder?id=${9}`
    })
  }
})