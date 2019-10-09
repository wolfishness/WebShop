const link = require('../../utils/common.js'),
  app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    partData: {},
    baitiao: [],
    //componentDatas: {
    //  btName: '支付',
    //  btDesc: '【白条支付】首单享立减优惠',
    //},
    componentDatas2: {
      selectedName: '已选',
      selectedColor: '',
      selectedSize: '',
      selectedNums: 0,
      productId: 0
    },
    isShowPopup: false,
    isShowSelected: false,
    badgeCount: 0,
    addResult: '',
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

    link.showLoading()

    link.ajax({
      url: `${app.globalData.defaultURL}/goods/getGoodDetail`,
      data: {
        goodsId: id
      }
    }, res => {
      let result = null;
      //console.log(res)
      //console.log(res.data)
      //console.log(res.data.partData)
      //console.log(res.data.partData.id)
      if (res.data.partData.id == id) {
        result = res.data
      }
      
      this.setData({
        partData: result.partData,
        
      })
      console.log(result.partData)

      link.hideLoading()
    })

    link.ajax({
      url: `${app.globalData.defaultURL}/goods/getProductList`,
      data: {
        goodsId: id
      }
    }, res => {
      this.setData({
        radio: res.data

      })
      console.log(res.data)
    })
  },

  popupLayer() {
    this.setData({
      isShowPopup: true
    })
  },
  selectChangeFlag({
    detail
  }) {
    let isBFQ = detail.desc = '不分期';
    this.setData({
      componentDatas: {
        btName: '支付',
        btDesc: isBFQ
      }
    })
  },
  showSelected() {
    this.setData({
      isShowSelected: true
    })
  },
  getCartNums({
    detail
  }) {
    this.data.componentDatas2.selectedColor = detail.color;
    this.data.componentDatas2.selectedSize = detail.size;
    this.data.componentDatas2.selectedNums = detail.num;
    this.data.componentDatas2.productId = detail.productId;
    this.setData({
      componentDatas2: this.data.componentDatas2
    })
    //this.addCarts()
  },
  addCarts() {
    console.log(this.data.componentDatas2.productId)
    console.log(this.data.componentDatas2.selectedNums)
    if (this.data.componentDatas2.productId != null && this.data.componentDatas2.selectedNums != 0) {
      link.ajax({
          url: `${app.globalData.defaultURL}/cart/addCart`,
          data: {
            memberId: wx.getStorageSync('id'),
            productId: this.data.componentDatas2.productId,
            quantity: this.data.componentDatas2.selectedNums,
          }
        }, res => {
          this.setData({
            addResult: res.data

          })
        }),
        wx.getStorage({
          key: 'cartInfo',
          success: (res) => {
            const cartArr = res.data;
            let isFlag = false;
            cartArr.forEach(item => {
              if (item.id == this.data.partData.id) {
                item.total += this.data.partData.count
                wx.setStorage({
                  key: 'cartInfo',
                  data: cartArr,
                })
                isFlag = true
              }
            })

            if (!isFlag) {
              this.data.partData.total = this.data.partData.count
              cartArr.push(this.data.partData)
              wx.setStorage({
                key: 'cartInfo',
                data: cartArr,
              })
            }
            this.getProductTotal(cartArr)
          },
          fail: err => {
            this.data.partData.total = this.data.partData.count
            let newArr = [];
            newArr.push(this.data.partData)
            wx.setStorage({
              key: 'cartInfo',
              data: newArr,
            })
            this.getProductTotal(newArr)
          }
        })
      wx.showToast({
        title: "成功加入购物车"
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '还未选择商品',
      })
    }


  },
  getProductTotal(arrLength) {
    this.setData({
      badgeCount: arrLength.length
    })
  },
  gotoCart() {
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.getStorage({
      key: 'cartInfo',
      success: (res) => {
        this.getProductTotal(res.data)
      },
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  toPlaceOrder: function() {
    if (this.data.componentDatas2.productId != null && this.data.componentDatas2.selectedNums != 0) {
      let partData = this.data.partData;
      let componentDatas2 = this.data.componentDatas2;
      var orderItems = '[{"goodsCode":"' + partData.goodsCode + '","goodsId":"' + partData.id + '","goodsName":"' + partData.goodName + '","goodsSize":"' + componentDatas2.selectedSize.substr(0, componentDatas2.selectedSize.length - 1) + '","imageUrl":"' + partData.images[0] + '","price":"' + partData.price + '","productId":"' + componentDatas2.productId + '","quantity":"' + componentDatas2.selectedNums + '","skuName":"' + componentDatas2.selectedColor.substr(0, componentDatas2.selectedColor.length - 1) + '"}]';


      wx.setStorageSync("orderItems", JSON.parse(orderItems))
      wx.navigateTo({
        url: '/pages/placeOrder/placeOrder',
      })

    } else {
      wx.showModal({
        title: '提示',
        content: '还未选择商品',
      })
    }
  }
})