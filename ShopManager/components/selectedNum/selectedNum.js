// components/selectedNum/selectedNum.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowSelected: {
      type: Boolean,
      default: false
    },
    partData: Object,
    radio: Object,
    radioSize: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    nums: 0,
    color: '',
    size: '',
    productId: 0,
    defaultURL:"https://www.lujinshan.top"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showSelectedPopup({
      target: {
        dataset: {
          current
        }
      }
    }) {
      if (current == 'current') {
        this.setData({
          isShowSelected: false
        }),

          this.triggerEvent('getCartNum', {
            color: this.data.color + ",",
            size: this.data.size + ",",
            num: this.data.nums,
            productId: this.data.productId
          })

      }
    },
    getCartVal({
      detail
    }) {
      this.data.partData.count = detail;
      this.setData({
        partData: this.data.partData,
        nums: detail
      })

      this.triggerEvent('getCartNum', {
        color: this.data.color + ",",
        size: this.data.size + ",",
        num: this.data.nums,
        productId: this.data.productId
      })
    },
    addCart() {
      this.setData({
        isShowSelected: false
      })
    },
    getRadioColor: function (e) {
      let index = e.currentTarget.dataset.id;
      let radio = this.properties.radio;
      let color;

      for (let i = 0; i < radio.productList.length; i++) {
        this.properties.radio.productList[i].checked = false;
      }
      if (radio.productList[index].checked) {
        this.properties.radio.productList[index].checked = false;
      } else {
        this.properties.radio.productList[index].checked = true;
        this.properties.radioSize = this.properties.radio.productList[index].colorSize;
        color = this.properties.radio.productList[index].name;
      }
      let userRadio = radio.productList.filter((item, index) => {
        return item.checked == true;
      })
      this.setData({
        radio: this.properties.radio,
        radioSize: this.properties.radio.productList[index].colorSize,
        color: color
      })
    },
    getRadioSize: function (e) {
      let index = e.currentTarget.dataset.id;
      let radioSize = this.properties.radioSize;
      let size;
      let productId;

      for (let i = 0; i < radioSize.length; i++) {
        this.properties.radioSize[i].checked = false;
      }
      if (radioSize[index].checked) {
        this.properties.radioSize[index].checked = false;
      } else {
        this.properties.radioSize[index].checked = true;
        size = this.properties.radioSize[index].goodsSize;
        productId = this.properties.radioSize[index].id;
      }
      let userRadio = radioSize.filter((item, index) => {
        return item.checked == true;
      })
      this.setData({
        radio: this.properties.radio,
        radioSize: this.properties.radioSize,
        size: size,
        productId: productId,
      })
      console.log(userRadio)
    }
  }
})