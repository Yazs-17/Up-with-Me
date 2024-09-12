// pages/start/index.js
const { formatTime } = require('../../util/Js-toolKit/formatTime')
let userInfo = wx.getStorageSync('userInfo');
Page({
  enterRightnow(){
    wx.reLaunch({
      url: '../user/index',
    })
  },
  skip_visitor(){
    wx.showModal({
      title: '详细信息可浏览我们的站点',
      content: 'http://www.yazs.top',
      showCancel:false,
      complete: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '../visitor/index',
          })
        }
      }
    })
  },
  data: {
    opa:0,
    flag:true,
    b_0:false,
    b_1:false,
    b_2:false
  },
  flip(){
    this.setData({
      b_1:true
    })
    setTimeout(()=>{
      this.setData({
        opa:1,
        b_2:true
      })
    },600)
  },
  tapBook(){
    this.setData({
      b_0:true
    })
    setTimeout(this.flip,600);

  },
  skip(){
    setTimeout(()=>{
      wx.showToast({
        title: '旅途愉快！',
        icon:'none'
      })
    },100)
    wx.reLaunch({
      url: '../user/index',
    })
  },
  /**
   *  look() 函数是测试函数
   */
  look(){
    wx.setStorageSync('partnerInfo', {});
  },

  //     unlockPartner
  // 重点函数  ***  重点函数
  async unlockPartner(){
    const db = await getApp().database();
    db.collection(getApp().globalData.habits).where({
      partner:wx.getStorageSync('partnerInfo').openid
    }).remove()
    db.collection(getApp().globalData.users).where({
      openid:userInfo.partner
    }).update({
      data:{
        partner:''
      }
    })
    db.collection(getApp().globalData.users).where({
      openid:userInfo.openid
    }).update({
      data:{
        partner:''
      }
    })
    wx.removeStorageSync('partnerInfo')

    // wx.clearStorageSync()
  },

  async tobepaidUpdate(e){ //传入openid 与 tobepaid金额 与 related金额 自动修改
  },
  async onLoad(options) {
    // this.unlockPartner()
    /**
     * 以下语句有bug,具体体现在无法准确判断值
     * 注意，已经验证storage的值可以在这里立刻改变
     */
    const db = await getApp().database()
    db.collection(getApp().globalData.habits).where({
      data:{
        openid:getApp().userOpenid
      }
    }).get().then(res=>{
      // let habits_list = res.data
      res.data.forEach((habit) => {
        if (habit.partner){
          let now = formatTime(new Date).slice(0,10)
          // console.log(666)
          // this.tobepaidUpdate()
          if (!((habit.init=="0") || (now > habit.date_1 && now <= habit.date_2 + 1 &&habit.freq==1))){
            wx.showModal({
              title: '您昨日未能完成既定习惯',
              content: '已与伙伴解绑，且押金不再退回',
              showCancel:false,
              confirmText:'确定，下次注意',
              complete: (res) => {
                if (res.confirm) {
                  userInfo.partner = ''
                  wx.setStorageSync('userInfo', userInfo);
                  wx.setStorageSync('partnerInfo', {});
                  this.unlockPartner();
                }
              }
            })
          }else {
            // console.log(habit)
            // 这里出了一个未知的BUG => 导致后台的项目无法用
            if (habit.init == "0"){
              // console.log(habit._id)
              // this.changToNow()
              // habit.init = now
              // console.log(habit)
            }
          }
        }
      })
    })
    if (userInfo.taskStatus == 1){
      //老式二次接口，防止习惯作弊，
      //再次检验习惯是否已经完成
    }
    if (userInfo.toBePaid != 0){
      wx.showModal({
        title: '支付金额 ￥5',
        content: '由于您昨日未能成功完成所有既定的习惯，请支付违约金',
        complete: (res) => {
          if (res.confirm) {
            this.tobepaidUpdate();
            // 联系的金额变成 所需的数字
            // 更新 清 0
            // 别忘了改变storage里面的值
          }
        }
      })
    }
  },
  async changToNow(e){
    let now = formatTime(new Date).slice(0,10)
    const db = await getApp().database()
    db.collection(getApp().globalData.habits).where({
      _id:event
    }).update({
      init:now
    })
  },
  onShow() {
  },
  onShareAppMessage() {

  }
})