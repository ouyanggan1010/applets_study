import regeneratorRuntime from'../../lib/runtime/runtime.js';
import { request } from "../../request/index.js";
//Page Object
Page({
  data: {
    //轮播图数组
    swiperList: [],
    //导航栏数组
    catesList: [],
    //图片楼层数据
    floorList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1.轮播图数据
    this.getSwiperList();
    //2.获取导航栏数据
    this.getCateList();
    //3.获取楼层数据
    this.getFloorList();
  },
  //----------------------请求数据的函数
  // 获取轮播图数据
  async getSwiperList() {
    const res = await request({ url: '/home/swiperdata' })
    this.setData({
      swiperList: res
    })
  },
  // 获取导航栏数据
  async getCateList() {
    const res = await request({ url: '/home/catitems' })
    this.setData({
      catesList: res
    })
  },
  // 异步获取楼层数据
  async getFloorList() {
    const res = await request({ url: '/home/floordata' });
    res.forEach(v => { 
      const change = v.product_list.map(v1 => {
        const arr = v1.navigator_url.split("?");
        v1.url = `${arr[0]}/index?${arr[1]}`;
        return v1;
      });
      v.product_list = change;
    })
    this.setData({
      floorList: res
    })
  }
});