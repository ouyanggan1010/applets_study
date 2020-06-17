import regeneratorRuntime from '../../lib/runtime/runtime.js';
import { request } from "../../request/index.js";
/* 
1.输入框绑定，值改变事件，input事件
  1.1获取到输入框的值
  1.2合法性判断
  1.3检验通过，把输入框的值发送到后台
  1.4返回的数据打印到页面上
2.防抖技术（防止抖动）定时器 还可以用在节流
  2.1防抖一般是用在输入框中，防止重复输入，重复请求
  2.2节流一般是用在页面上拉下拉刷新中
  2.3定义一个全局的定时器id
*/
// pages/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList: [],
    isBtn: true,
    inputVal:""
  },
  // 定时器id
  TimeId: -1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // ----------------------请求函数
  async getSearch(value) {
    const query = value;
    const res = await request({ url: "/goods/qsearch", data: { query } });
    this.setData({
      searchList: res
    });
  },
  // ----------------------事件函数
  // 输入框输入事件
  bindKeyInput(e) {
    const { value } = e.detail;
    // 检验输入框的值是否合法
    if (!value.trim()) {
      this.setData({
        searchList: [],
        isBtn: true
      });
      return;
    }
    // 输入框有值，则将值放入data中
    this.setData({
      isBtn: false
    });
    // 定时器防抖
    /*这里是每次输入一个字母的时候，比如“华为”，在输入h的时候会清除定时器，
    然后开启一个1秒后的定时器，输入u的时候又重复，直道输入最后一个字母，
    等待1秒后就开始请求
     */
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      // 请求
      this.getSearch(value);
    }, 1000);
  },
  // 取消按钮点击事件
  cancelInp() {
    this.setData({
      inputVal:"",
      isBtn: true,
      searchList: []
    })
  }
})