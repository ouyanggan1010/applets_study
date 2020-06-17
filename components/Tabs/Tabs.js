// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    },
    showShaw: {
      type: Boolean,
      value: false
    },
    isTop: {
      type: Boolean,
      value: true
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
    // 导航列表点击事件
    handleItemTap(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent("tabChange", { index });
    }
  }
})
