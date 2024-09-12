// pages/oneSentence/index.js
Page({
  data:{
    moto:{
      content:"一个习惯，就是一句承诺",
      origin:"Yazs"
    }
  },
  onShow(){
    let that = this;
    wx.request({
      url: 'https://api.xygeng.cn/one',
      method:'GET',
      dataType:'json',
      success:function(res) {
        that.setData({
          moto:res.data.data
        })
      },
      fail:function(e) {
        wx.showToast({
          title: '请求网络失败',
          icon:'error'
        })
      }
    })
  }
})