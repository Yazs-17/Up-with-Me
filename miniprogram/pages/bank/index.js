// pages/bank/index.js
Page({
  data: {

  },
  onLoad(options) {

  },
  async loadBankdata(){
    const db =await getApp().database()
    db.collection(getApp().globalData.bank).where({
      _openid:getApp().bank
    }).get().then(res=>{
      const {
        data
      } = res
      this.setData({
        bank:data
      })
    })
  },
  onReady() {

  },
  onShow() {

  }
})