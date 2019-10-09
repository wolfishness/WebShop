// pages/orderDetail/orderDetail.js

const link = require('../../utils/common.js'),
  app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail:"",
    orderId:0,
    defaultURL:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({id}) {
    var defaultURL = app.globalData.defaultURL

    this.setData({
      defaultURL: defaultURL
    })
    this.setData({
      orderId:id
    })
    link.ajax({
      url: `${app.globalData.defaultURL}/order/getOrderDetail`,
      data: {
        orderId:id
      }
    }, res => {
      //console.log(res)
      this.setData({
        orderDetail:res.data.data
      })
      
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toRefund({
    currentTarget: {
      dataset: {
        index
      }
    }
  }){
    link.ajax({
      url: `${app.globalData.defaultURL}/order/insertAfterSaleApply`,
      data: {
        orderId: this.data.orderId,
        orderItemId: this.data.orderDetail.itemObject[index].id
      }
    }, res => {
      console.log(res)
      if (res.data.errcode == 0){
        wx.showToast({
          title: '成功发起退货',
          icon:'success'
        })
      }else{
        if (res.data.errmsg == "" || res.data.errmsg == null){
          wx.showToast({
            title: "发起退货失败",
          })
        }else{
          wx.showToast({
            title: res.data.errmsg,
          })
        }
        

      }
      
    })
  }
})