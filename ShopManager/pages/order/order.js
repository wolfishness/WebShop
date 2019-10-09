// pages/order/order.js
const link = require('../../utils/common.js'),
  app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
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
    orderList: [],
    typeId: 0,
    orderId: 0,
    isSelected: false,
    defaultURL:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function({
    id
  }) {
    var defaultURL = app.globalData.defaultURL

    this.setData({
      defaultURL: defaultURL
    })

    let orderItems = this.data.orderItems
    for (var i = 0; i < orderItems.length; i++) {
      if (orderItems[i].typeId == id) {
        orderItems[i].imageurl = orderItems[i].imageurl.toString().replace('0', '1');
      }
    }
    this.setData({
      orderItems: orderItems,
      typeId: id
    })
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("dsda")
    this.getOrdersList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      orderList:[]
    })

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      index: 1
    })
    this.getOrdersList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({
      index: ++this.data.index
    })
    this.getOrdersList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getOrdersList() {
    var typeId = this.data.typeId
    if(typeId == 9){
      link.ajax({
        url: `${app.globalData.defaultURL}/order/getOrderList`,
        data: {
          memberId: wx.getStorageSync('id'),
          index: this.data.index,
          status: this.data.typeId
        }
      }, res => {
        var orderList = this.data.orderList
        var resFind = res.data.data
        console.log(resFind)
        for (var i = 0; i < resFind.length ; i++){
    
          for(var j = 0 ; j < resFind[i].itemObject.length ; j++){
   
            if(resFind[i].itemObject[j].refundStatus == 0){
              resFind[i].itemObject.splice(j,1)
              j--;
            }
            
          }
          orderList.push(resFind[i])
        }
        console.log(orderList)
        this.setData({
          orderList: orderList
        })
      })
    }else{
      link.ajax({
        url: `${app.globalData.defaultURL}/order/getOrderList`,
        data: {
          memberId: wx.getStorageSync('id'),
          index: this.data.index,
          status: this.data.typeId
        }
      }, res => {
        var orderList = this.data.orderList
        if (res.data.data.length > 0) {
          res.data.data.forEach(item => {
            orderList.push(item)
          })

        }
        this.setData({
          orderList: orderList
        })
      })
    }
    
  },
  selectType({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    wx.navigateTo({
      url: `/pages/order/order?id=${this.data.orderItems[index].typeId}`
    })
  },
  toPay({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否付款',
      success: function(resModel) {
        if (resModel.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')
          that.setData({
            orderId: index
          })
          that.changeStatus(2)
        } else { //这里是点击了取消以后
          console.log('用户点击取消')

        }
      }
    })
  },
  toCancel({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否取消订单',
      success: function(resModel) {
        if (resModel.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')
          that.setData({
            orderId: index
          })
          that.changeStatus(5)
        } else { //这里是点击了取消以后
          console.log('用户点击取消')

        }
      }
    })
  },
  toConfirm({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确认收货',
      success: function(resModel) {
        if (resModel.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')
          that.setData({
            orderId: index
          })
          that.changeStatus(6)
        } else { //这里是点击了取消以后
          console.log('用户点击取消')

        }
      }
    })
  },
  toDel({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除订单',
      success: function(resModel) {
        if (resModel.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')
          that.setData({
            orderId: index
          })
          that.changeStatus(-1)
        } else { //这里是点击了取消以后
          console.log('用户点击取消')

        }
      }
    })
  }, 
  toRemind(){
    wx.showModal({
      title: '提示',
      content: '提醒信息已发送',
      success: function (resModel) {
        if (resModel.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')
        } else { //这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
  },
  toDilivery(){
    this.setData({
      isSelected:true
    })
  }
  ,
  changeStatus(status) {
    var orderList = this.data.orderList;
    var index = this.data.orderId;
    link.ajax({
      url: `${app.globalData.defaultURL}/order/changeOrderStatus`,
      data: {
        orderId: orderList[index].id,
        status: status
      }
    }, res => {
      if (res.data.data == "success") {
        this.getOrdersList()
      }
    })
  },
  enterDetail({
    currentTarget: {
      dataset: {
        index
      }
    }
  }){
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${this.data.orderList[index].id}`,
    })
  }
})