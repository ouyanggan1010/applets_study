import { chooseImage, showModal, showToast, uploadFile } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
// pages/feedback/index.js
/* 
1.点击“+”号按钮，触发点击事件
  1.1调用小程序内置的选择图片api
  1.2获取到图片路径，数组格式
  1.3页面就可以根据图片数组进行循环显示
2.提交按钮
  2.1获取文本域的内容
    2.1.1在data中定义一个变量
    2.1.2文本域中绑定输入事件，在输入的时候将值放入data中
  2.2对这些内容的合法性进行验证
  2.3验证通过，用户选择的图片上传到专门的图片服务器，返回图片外网的链接
    2.3.1遍历数组，挨个上传
    2.3.2将上传成功的图片外网链接，重新放入一个图片数组中整合
  2.4文本域和外网的图片路径，一起提交到服务器，前端模拟，不发送请求
  2.5清空当前页面
  2.6返回上一页
*/

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      value: "体验问题",
      isActive: true,
      type: 1
    }, {
      id: 1,
      value: "商品、商家投诉",
      isActive: false,
      type: 2
    }],
    // 切换栏底部是否加阴影
    shawBool: false,
    // 被选中的图片数组
    chooseImg: [],
    // 文本域的内容
    textVal: ""
  },
  // 点击切换列表获取type值
  type: 1,
  // 外网的图片路径数组
  upLoadImgs: [],
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 没有形参options，获取不到链接中传过来的参数
    // 可以通过小程序的页面栈来获取参数
    let pages = getCurrentPages();
    this.type = pages[pages.length - 1].options.type;

    // 动态更改标题选中
    this.changeTabs((this.type - 1));
  },

  /* 
   * 生命周期函数--监听用户滑动页面事件
   */
  onPageScroll(options) {
    this.setData({
      shawBool: options.scrollTop ? true : false
    })
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
  },
  // 点击删除图片，只要绑定了事件，都可以获取该标签上的data-参数
  async handleTapClear(e) {
    const { index } = e.currentTarget.dataset;
    let { chooseImg } = this.data;
    const res = await showModal({ title: "删除", content: "是否删除图片？" });
    if (res.confirm) {
      chooseImg.splice(index, 1);
      this.setData({
        chooseImg
      })
    }
  },
  // 点击选择图片
  async handleChooseImg() {
    try {
      const res = await chooseImage();
      // 拼接数组
      this.setData({
        chooseImg: [...this.data.chooseImg, ...res.tempFilePaths]
      })
    } catch (error) {
      console.log(error)
    }
  },
  // 文本域输入事件
  handleTextInput(e) {
    const { value } = e.detail;
    this.setData({
      textVal: value
    })
  },
  // ---------------------------请求函数
  // 点击提交按钮
  async handleFormSubmit() {
    try {
      const { textVal, chooseImg } = this.data;
      if (!textVal.trim()) {
        await showToast({ title: "请输入问题", icon: "none", mask: true });
        return;
      }
      // 上传loading
      wx.showLoading({
        title: '提交中',
        mask: true
      })
      if (chooseImg.length > 0) {
        // wx.uploadFile()不支持多个文件同时上传，遍历数组，挨个上传
        chooseImg.forEach(async (v, i) => {
          // const res = await uploadFile({
          //   //图片要上传到哪里
          //   url: 'https://images.ac.cn/Home/Index/UploadAction/',
          //   // 被上传的文件路径
          //   filePath: v,
          //   // 与后台约定好的，上传文件的名称，后台可用这个名称来获取文件，一般是'file'
          //   name: 'file',
          //   // 额外上传所带的文本信息
          //   formData: {}
          // });
          // this.upLoadImgs.push(JSON.parse(res.data).url);
          if (i === chooseImg.length - 1) {
            console.log("将文本域与图片数组上传到后台");
            await showToast({ title: "上传成功", icon: "none" });
            // 清空页面，并跳转
            this.setData({
              textVal: "",
              chooseImg: []
            });
            setTimeout(() => {
              wx.hideLoading();
              wx.navigateBack({
                delta: 1
              });
            }, 1500);
          }
        });
      } else {
        console.log("将文本域上传到后台");
        await showToast({ title: "上传成功", icon: "none" });
        // 清空页面，并跳转
        this.setData({
          textVal: "",
          chooseImg: []
        });
        setTimeout(() => {
          wx.hideLoading();
          wx.navigateBack({
            delta: 1
          });
        }, 1500);
      }
    } catch (error) {
      console.log(error)
    }
  }
})