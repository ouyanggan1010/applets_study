import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime.js';
// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      value: "商品收藏",
      isActive: true,
      type: 1
    }, {
      id: 1,
      value: "品牌收藏",
      isActive: false,
      type: 2
    }, {
      id: 2,
      value: "店铺收藏",
      isActive: false,
      type: 3
    }, {
      id: 3,
      value: "浏览足迹",
      isActive: false,
      type: 3
    }],
    // 切换栏底部是否加阴影
    shawBool: false,
    // 收藏数据
    collectList: []
  },
  // 点击切换列表获取type值
  type: 1,
  /**
   * 生命周期函数--页面打开，因为订单页面时会被频繁打开的
   */
  onShow() {
    // 没有形参options，获取不到链接中传过来的参数
    // 可以通过小程序的页面栈来获取参数
    let pages = getCurrentPages();
    this.type = pages[pages.length - 1].options.type;

    // 动态更改标题选中
    this.changeTabs((this.type - 1));
    // 渲染数据
    this.getCollectList();
  },
  /* 
   * 生命周期函数--监听用户的下拉动作
   */
  onPullDownRefresh() {
    this.getCollectList();
  },
  /* 
   * 生命周期函数--监听用户滑动页面事件
   */
  onPageScroll(options) {
    this.setData({
      shawBool: options.scrollTop ? true : false
    })
  },
  // -----------------请求函数
  async getCollectList() {
    if (this.type) {
      const res = wx.getStorageSync('collect') || [];
      this.setData({
        collectList: res
      })
    }
    // 关闭下拉刷新，即使没有调用下拉刷新的效果，直接关闭不会报错
    wx.stopPullDownRefresh();
  },
  // -------------事件函数
  // 标题激活
  changeTabs(index) {
    let { tabs } = this.data;
    tabs.forEach((v, i) => {
      return i === index ? v.isActive = true : v.isActive = false
    });
    this.type = tabs[index].type;
    this.setData({
      tabs
    });
  },
  handleTabChange(e) {
    const { index } = e.detail;
    this.changeTabs(index);
  }
})