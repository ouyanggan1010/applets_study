import regeneratorRuntime from '../../lib/runtime/runtime.js';
import { request } from "../../request/index.js";
import { showToast } from "../../utils/asyncWx.js";
/* 
商品的收藏：
1.在onShow中判断缓存的收藏数组中是否有当前商品
  1.1有：将收藏图标变红
  1.2没有：将收藏图标变白
2.点击收藏图标，先判断缓存中是否有当前商品
  1.1有：删除收藏缓存中的商品
  1.2没有：在缓存数组汇总添加该商品
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    collectIcon: false,//该商品是否已收藏
  },
  goodsInfo: {},
  /**
   * 生命周期函数--监听页面打开
   */
  onShow: function () {
    const pages = getCurrentPages();
    const { goods_id } = pages[pages.length - 1].options;
    this.getGoodsDetail(goods_id);
  },
  //----------------------请求数据的函数
  // 获取商品的详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({ url: "/goods/detail", data: { goods_id } });
    this.goodsInfo = res;
    const obj = {
      goods_id: res.goods_id,
      pics: res.pics,
      goods_price: res.goods_price,
      goods_name: res.goods_name,
      /* 如果有在某些机型上面不能识别的图片格式，例如：webp
      1.让后台更改，正常操作是这种方式
      2.前端将所有webp文件的后缀名全部替换成jpg或png格式的，前提是后台也有jpg或png格式的图片 */
      goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg')
    }
    // 获取缓存中收藏的数组
    let collect = wx.getStorageSync('collect') || [];
    const bool = collect.length ? collect.some(v => v.goods_id === this.goodsInfo.goods_id) : false;
    this.setData({
      collectIcon: bool,
      goodsObj: obj
    })
  },
  //----------------------事件函数
  // 预览轮播大图
  previewImage(e) {
    const { url } = e.currentTarget.dataset;
    const urls = this.goodsInfo.pics.map(item => item.pics_big);
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  // 加入购物车
  /* 1.绑定点击事件
     2.获取缓存中的购物车数据 数组格式 
     3.先判断当前商品是否已经存在于购物车
     4.已经存在，修改商品数据，执行购物车数量++，重新填充到缓存当中
     5.不存在与购物车数组中，直接给购物车数组添加一个新元素，带上购买数量属性num，重新填充到缓存当中
     6.弹出提示
  */
  handleCartAdd(e) {
    let cart = wx.getStorageSync('cart') || [];
    const index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id);
    if (index === -1) {
      // 不存在购物车中
      this.goodsInfo.num = 1;
      // 购物车选中状态
      this.goodsInfo.checked = false;
      cart.push(this.goodsInfo)
    } else {
      // 存在购物车中
      cart[index].num++;
    }
    wx.setStorageSync('cart', cart);
    // 弹框提示
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true
    })
  },
  // 点击收藏按钮
  handleCollect() {
    let str;
    let collect = wx.getStorageSync('collect') || [];
    const index = collect.findIndex(v => v.goods_id == this.goodsInfo.goods_id);
    let bool = true;
    if (collect.length > 0 && index > -1) {
      collect.splice(index, 1);
      bool = false;
      // 弹框提示
      str = '取消成功';
    } else {
      collect.push(this.goodsInfo);
      str = '收藏成功';
    }
    wx.setStorageSync('collect', collect);
    this.setData({
      collectIcon: bool
    });
    // 弹框提示
    wx.showToast({
      title: str,
      icon: 'success',
      mask: true
    })
  }
})