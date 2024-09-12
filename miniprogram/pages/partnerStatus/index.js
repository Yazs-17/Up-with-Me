// pages/partnerStatus/index.js
Page({
  data: {

  },
  onLoad(options) {

  },
  onShow() {
    wx.showModal({
      title: '正在申请权限~',
      content: '开发中...',
      showCancel:false,
      complete: (res) => {
        if (res.confirm) {
          wx.navigateBack()
        }
      }
    })
  }
})