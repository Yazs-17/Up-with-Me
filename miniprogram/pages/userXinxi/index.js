// pages/userXinxi/index.js
const { formatTime } = require('../../util/Js-toolKit/formatTime');
let money = [0.5];
for (let i = 1; i <= 12; i += 1) {
  money.push(i);
}
Page({
  data: {
    navItems:['头像昵称信息','金币描述信息'],
    now_nav_index:0,
    money: money,
    value: []
  },
  async submitIcon(){
    const db = await getApp().database()
    db.collection(getApp().globalData.users).where({
      openid:getApp().userOpenid
    }).update({
      data:{
        relatedIcon:this.data.relatedIcon
      }
    })
    wx.showToast({
      title: '更改成功',
      icon:'success'
    })
    let userInfo = wx.getStorageSync('userInfo')
    userInfo.relatedIcon = this.data.relatedIcon
    wx.setStorageSync('userInfo', userInfo)
  },
  bindDeschange(e){
    this.setData({
      des:e.detail.value
    })
    this.submitDes()
  },
  async submitDes() {
    const db = await getApp().database()
    db.collection(getApp().globalData.users).where({
      openid:getApp().userOpenid
    }).update({
      data:{
        des:this.data.des
      }
    })
    wx.showToast({
      title: '更改成功',
      icon:'success'
    })
    let userInfo = wx.getStorageSync('userInfo')
    userInfo.des = this.data.des
    wx.setStorageSync('userInfo', userInfo)
  },
  bindmoneyChange: function (e) {
    const val = e.detail.value[0]
    // console.log(val)
    this.setData({
      relatedIcon:val
    })
  },
  onInputname(e) {
    this.setData({
      nickName:e.detail.value
    })
  },
  async upLoadInfoname(){
    const db = await getApp().database()
    db.collection(getApp().globalData.users).where({
      openid:getApp().userOpenid
    }).update({
      data:{
        nickName:this.data.nickName
      }
    })
    wx.showToast({
      title: '更改成功',
      icon:'success'
    })
    let userInfo = wx.getStorageSync('userInfo')
    userInfo.nickName = this.data.nickName
    wx.setStorageSync('userInfo', userInfo)
  },
  changeAvator(){
    let thatt = this
    wx.chooseImage({
      count:1,
      sizeType:['original'],
      sourceType:['album', 'camera'],
      success(res) {
        thatt.setData({
          src:res.tempFilePaths
        })
        let that = thatt
        wx.showLoading({
          title: '上传中'
        })
        let time = formatTime(new Date)
        wx.cloud.uploadFile({
          cloudPath:'trial/' + time,
          filePath:that.data.src[0]
        }).then(res => {
          console.log(res)
          let fileID = res.fileID
          that.changeAvatar(fileID)
        }).catch(error => {
          console.log(error);
        })
      }
    })
  },
  async changeAvatar(fileID) {
    const db = await getApp().database()
    db.collection(getApp().globalData.users).where({
      openid:getApp().userOpenid
    }).update({
      data: {
        avatarUrl:fileID
      }
    })
    wx.hideLoading()
    wx.showToast({
      title: '上传成功~',
    })
    this.setData({
      avatarUrl:fileID
    })
    let userInfo = wx.getStorageSync('userInfo')
    userInfo.avatarUrl = fileID
    wx.setStorageSync('userInfo', userInfo)
  },
  changeIndex(e){
    let itemIndex = e.currentTarget.dataset.index
    this.setData({
      now_nav_index:itemIndex
    })
  },
  async backAvator(){
    let url = "cloud://yazs-6gxdrucu8ba7c523.7961-yazs-6gxdrucu8ba7c523-1321500807/user.png"
    wx.showLoading({
      title: '上传中'
    })
    const db = await getApp().database()
    db.collection(getApp().globalData.users).where({
      openid:getApp().userOpenid
    }).update({
      data: {
        avatarUrl: url
      }
    })
    wx.hideLoading()
    wx.showToast({
      title: '修改成功~',
    })
    this.setData({
      avatarUrl:url
    })
    let userInfo = wx.getStorageSync('userInfo')
    userInfo.avatarUrl = url
    wx.setStorageSync('userInfo', userInfo)
  },
  onShow() {
    this.loaduserInfo()
  },
  loaduserInfo() {
    let userInfo = wx.getStorageSync('userInfo')
    // console.log(userInfo)
    let value = []
    let index = money.findIndex(e => e===userInfo.relatedIcon)
    value.push(index+1)
    console.log(value)
    this.setData({
      avatarUrl:userInfo.avatarUrl,
      nickName:userInfo.nickName,
      relatedIcon:userInfo.relatedIcon,
      cate:userInfo.cate,
      des:userInfo.des,
      value:value
    })
  }
})