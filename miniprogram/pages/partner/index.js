// pages/partner/index.js
Page({
  data: {
    partnerInfo:wx.getStorageSync('partnerInfo'),
    nodes: [{
      name: 'div',
      attrs: {
        class: 'richText'
      },
      children: [{
        type: 'text',
        text: wx.getStorageSync('partnerInfo').des ? wx.getStorageSync('partnerInfo').des : "您还没有伙伴哦~"
      }]
    }]
  },
  onLoad(options) {
    if (!(this.data.partnerInfo)){
      wx.showToast({
        title: '您还没有伙伴哦~',
        icon:"error",
        duration:1500
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '../partnerFind/index',
        })
      },1500)
    }
  },
  onReady() {
    
  },
  onShow() {
  }
})