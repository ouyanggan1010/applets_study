import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime.js';

/* 
页面操作步骤
1.页面被打开的时候onShow
  1.onShow不同于onLoad无法在形参上接收options数据，可通过页面栈来获取参数
  2.在请求之前先判断是否有token值
    没有--跳转到授权页面
    有--进行下一步
  3.获取页面栈上url的参数type
  4.更具type值来设置标题栏哪个被激活选中
  5.根据type值去发送请求获取订单数据
  6.渲染页面
2.点击不同的标题，重新发送请求渲染数据
*/

// pages/order/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      value: "全部",
      isActive: true,
      type: 1
    }, {
      id: 1,
      value: "待付款",
      isActive: false,
      type: 2
    }, {
      id: 2,
      value: "待发货",
      isActive: false,
      type: 3
    }, {
      id: 3,
      value: "退款/退货",
      isActive: false
    }],
    // 切换栏底部是否加阴影
    shawBool: false,
    // 订单列表数据
    orderList: []
  },
  // 点击切换列表获取type值
  type: 1,
  /**
   * 生命周期函数--页面加载
   */
  // onLoad(options) {
  //   this.type = options.type;
  // },
  /**
   * 生命周期函数--页面打开，因为订单页面时会被频繁打开的
   */
  onShow() {
    // 判断token
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }

    // 没有形参options，获取不到链接中传过来的参数
    // 可以通过小程序的页面栈来获取参数
    let pages = getCurrentPages();
    this.type = pages[pages.length - 1].options.type;

    // 动态更改标题选中
    this.changeTabs((this.type - 1));
    // 渲染数据
    this.getOrderList();
  },
  /* 
   * 生命周期函数--监听用户的下拉动作
   */
  onPullDownRefresh() {
    this.getOrderList();
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
  async getOrderList() {
    if (this.type) {
      // 没有token，所以获取不到订单数据
      const res = await request({ url: '/my/orders/all', data: { type: this.type } });
      const order = [
        {
          "order_id": 428,
          "user_id": 23,
          "order_number": "HMDD20190802000000000428",
          "order_price": 13999,
          "order_pay": "0",
          "is_send": "否",
          "trade_no": "",
          "order_fapiao_title": "个人",
          "order_fapiao_company": "",
          "order_fapiao_content": "",
          "consignee_addr": "广东省广州市海珠区新港中路397号",
          "pay_status": "1",
          "create_time": 1564731518,
          "update_time": 1564731518,
          "order_detail": null,
          "goods": [
            {
              "id": 717,
              "order_id": 428,
              "goods_id": 43986,
              "goods_price": 13999,
              "goods_number": 1,
              "goods_total_price": 13999,
              "goods_name": "海信(Hisense)LED55MU9600X3DUC 55英寸 4K超高清量子点电视 ULED画质 VIDAA系统",
              "goods_small_logo": "http://image5.suning.cn/uimg/b2c/newcatentries/0000000000-000000000160455569_1_400x400.jpg"
            }
          ],
          "total_count": 1,
          "total_price": 13999
        }
      ]
      this.setData({
        orderList: order.map(v => ({ ...v,create_time_cn:(new Date(v.create_time * 1000).toLocaleString())}))
      });
    }
    // 关闭下拉刷新，即使没有调用下拉刷新的效果，直接关闭不会报错
    wx.stopPullDownRefresh();
  },
  // -----------------事件函数
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
  // 标题切换
  handleTabChange(e) {
    const { index } = e.detail;
    this.changeTabs(index);
    this.getOrderList();
  }
})