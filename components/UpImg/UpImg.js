// components/UpImg/UpImg.js
Component({
  options: {
    // 表示组件可以使用全局样式
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    imgPic: {
      type: String,
      value: "../../styles/images/noImg.png"
    },
    index: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClear(e) {
      this.triggerEvent("tapClear");
    }
  }
})
