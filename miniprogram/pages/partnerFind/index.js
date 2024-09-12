// pages/partnerFind/index.js
Page({
  // 设置一个比例 // 六个此
  sum(arr) {
    let summ = 0;
    for (let i = 0;i < arr.length;i++){
      summ += arr[i];
    }
    return summ;
  },
  skip_to_desc(){
    wx.navigateTo({
      url: '../desc/index',
    })
  },
  data: {
    showPercent:true,
    percentItems:[
      '1.外向性(Extraversion)',
      '2.宜人性 (Agreeableness)',
      '3.尽责性(Conscientiousness)',
      '4.开放性(Openness)',
      '5.学习性(learnability)',
      '6.灵活性(flexibility)'
    ],
    percent:[10,10,10,10,10,10],
  },
  checkSlidernums(e){
    //e.detail.value
    let percent_b = this.data.percent;
    let index = e.target.dataset.index
    percent_b[index] = e.detail.value;
    if (this.sum(percent_b) > 60){
      percent_b[index] 
      wx.showModal({
        title: '总分不可以超过60分！！！',
        content: '已回到原始数据！',
        showCancel:false,
        complete: (res) => {
          if (res.confirm) {
            this.setData({
              percent:[10,10,10,10,10,10]
            })
          }
        }
      })
      console.log(e.target.dataset.index)
      console.log(this.data.percent)
      return
    }
    this.setData({
      percent:percent_b
    })
    console.log(e.target.dataset.index)
    console.log(this.sum(this.data.percent))
  },
  async bemypartner(){
    // 支付押金时候，应该是待对方确认之后一起支付
    // code（。。。）

    /**
     * 实际的做法
     * let openid = this.data.partnerInfo.openid
     */

    // 
    // 测试版不得已的做法
    let openid = getApp().userOpenid
    //人数多起来之后的逻辑 ： 
    const db = await getApp().database()
    // console.log(this.data.max)
    db.collection(getApp().globalData.msg).add({
      data: {
        target :openid,
        cate:2, //cate 取值 {1,2,3}
        point:this.data.point,
        founder:wx.getStorageSync('userInfo').nickName,
        founderOpenid:getApp().userOpenid
      }
    })
    wx.showToast({
      title: '发送成功',
      duration:800
    })
    setTimeout(()=>{
      wx.redirectTo({
        url: '../msg/index',
      })
    },800)
  },
  hidePercentAndstartfinding() {
    wx.showLoading({
      title: '匹配中...',
    })
    setTimeout(()=>{
      this.setData({
        showPercent:false
      })
      this.ifFinding()
    },1500)
    // 寻找函数
  },
  onLoad(options) {

  },
  onShow() {
    this.checkIsuser()
  },

  checkIsuser() {
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo.userPersonality[0]){
      wx.showToast({
        title: '请先填写用户特征哦~',
        icon:'error',
        duration:1500
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '../userPersonality/index',
        })
      })
    }
  },
  // 最终函数
  ifFinding() {
    // 第一步
    this.loadUsers()
    // console.log(this.data.maxopenid)

    wx.hideLoading()
  },
  async loadUsers(){
    let userPersonality = wx.getStorageSync('userInfo').userPersonality[1]
    let cate = wx.getStorageSync('userInfo').cate[0]
    let max = 0
    let maxopenid = ''
    let stack = 0
    // console.log(userPersonality)
    const db = await getApp().database()
    db.collection(getApp().globalData.users).get().then(res => {
      const {
        data
      } = res
      this.setData({
        users:data
      })
      let that = this
      data.forEach(e => {
        let thatt = that
        if (e.openid != getApp().userOpenid && e.userPersonality[0] != 0 && e.cate[0]==cate){
          e.userPersonality[1].forEach((ee,index)=>{
            stack += Math.abs(ee - userPersonality[index]) * thatt.data.percent[index] / 10
            // console.log(ee,index)
          })
          // console.log(stack)
          stack = 60 - stack
          if (stack > max){
            max = stack
            maxopenid = e.openid
          }
          console.log(max)
          stack = 0
          thatt.setData({
            maxopenid:maxopenid,
            partnerInfo:e,
            point:max
          })
        }
      })
    })
    // console.log(this.data.partnerInfo)
    // 小程序
  }
})