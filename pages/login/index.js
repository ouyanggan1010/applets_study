import regeneratorRuntime from '../../lib/runtime/runtime.js';
import { getSetting, openSetting } from "../../utils/asyncWx.js";
// pages/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // --------------事件函数
  async handleGetUserInfo(e) { 
    const { userInfo } = e.detail;
    wx.setStorageSync('userInfo', userInfo);
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
    })
  }
})