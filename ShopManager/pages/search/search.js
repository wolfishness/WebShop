// pages/search/search.js
const link = require('../../utils/common.js'),
  app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    pageNum: 1,
    productList: [], // 列表数据
    noData: false,
    search: Object,
    defaultURL:""
  },
  clearInput() {
    this.setData({
      inputVal: ''
    })
    this.setData({
      productList: "",
      noData:false
    })
    this.onShow()
  },
  inputTyping(e) {
    this.setData({
      inputVal: e.detail.value
    })
    //this.search()
  },
  search() {
    //wx.setStorageSync("search", "")
    //var search = wx.getStorageSync("search")

    if (this.data.inputVal == null || this.data.inputVal == "")return
    var search  = wx.getStorageSync("search")
    console.log(search)
    if (search == null || search == "") {
      search = new Array();
      search.push(this.data.inputVal)
    } else {
      var flag = false;
      var inputValue = this.data.inputVal;
      for(var i =0 ; i< search.length ; i++){
        //console.log(search[i].toString())
        if (search[i].toString() == inputValue.toString()){
          console.log(i +"   " + j)
          
          for(var j = i ; j >0  ; j--){
            search[j] = search[j-1]
          }
          search[0] = inputValue;
          flag = true;
          break;
        }
      }
      if(flag == false){
        console.log(search)
        console.log(this.data.inputVal)
        search.push(this.data.inputVal)
        console.log(search)
        if(search.length > 15){
          search.splice(15,search.length - 15)
        }
        for (var j = i; j > 0; j--) {
          search[j] = search[j - 1]
        }
        search[0] = this.data.inputVal
      }
      
    }
    //console.log(search)
    wx.setStorageSync("search", search)
    this.setData({
      pageNum: 1
    })
    link.ajax({
      url: `${app.globalData.defaultURL}/goods/getListByName`,
      data: {
        name: this.data.inputVal,
        index: this.data.pageNum
      }
    }, res => {
      console.log(res)
      var productList = "";
      if (res.data != "" && res.data != null) {
        productList = res.data.data
      } else {
        this.setData({
          noData: true
        })
      }

      this.setData({
        productList: productList
      })
      // 隐藏loading
      link.hideLoading();

      // 关闭下拉刷新
      setTimeout(_ => {
        wx.stopPullDownRefresh();
      }, 600)
    })
  },
  redirectTo(e) {
    console.log(e)
    App.WxService.redirectTo('/pages/goods/list/index', {
      keyword: e.currentTarget.dataset.keyword
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //wx.setStorageSync("search", "")
    var defaultURL = app.globalData.defaultURL

    this.setData({
      defaultURL: defaultURL
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
    var search = wx.getStorageSync("search")
    this.setData({
      search: search,
      productList: ""
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      search: "",
      productList: ""
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

    // 重置页数
    this.setData({
      pageNum: 1
    })
    this.search(); // 重新向后台请求数据
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.stopPullDownRefresh(); // 停止下拉刷新状态
    wx.showNavigationBarLoading(); // 显示导航栏的loading

    this.setData({
      pageNum: ++this.data.pageNum
    })

    link.ajax({
      url: `${app.globalData.defaultURL}/goods/getListByName`,
      data: {
        name: this.data.inputVal,
        index: this.data.pageNum
      }
    }, res => {
      console.log(res.data)
      if (res.data.length !== 0) { // 判断数组不等于0 给列表的数组添加
        res.data.data.forEach(item => {
          this.data.productList.push(item);
        })
        this.setData({
          productList: this.data.productList // 在设置给data
        })
      } else { // 如果等于0了那么下面的无数据显示
        this.setData({
          noData: true
        })
      }
      setTimeout(_ => { // 隐藏导航栏的loading
        wx.hideNavigationBarLoading();
      }, 600)
    })


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 去往商品详情页
  downGoods({
    currentTarget: {
      dataset: {
        index: item
      }
    }
  }) {
    console.log(this.data.productList[item].id)
    var that = this
    link.ajax({
      url: `${app.globalData.defaultURL}/goods/downGoods`,
      data: {
        goodsId: this.data.productList[item].id,
        memberId: Number(wx.getStorageSync("id"))
      }
    }, res => {
      console.log(res)
      if (res.data == "ok") {
        that.search()
      }
      else {
        wx.showModal({
          title: '提示',
          content: '下架失败',
        })
      }
    })
  },
  cahngeSearch({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    var search = this.data.search;
    var inputValue = search[index]
    this.setData({
      inputVal : inputValue
    })
    this.search()
  }, delSearch(){
    wx.setStorageSync("search", "");
    this.onShow()
  }
})