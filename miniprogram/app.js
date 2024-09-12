// const { update } = require("XrFrame/kanata/lib/index");
// app.js
App({
  async onLaunch() {
    this.initcloud();
    this.globalData = {
        users:"UP-users",
        habits:'UP-preHabits',
        msg:'UP-message',
        bank:'UP-bank'
    }
    await this.getOpenId().then((res)=>{
      this.userOpenid = res;
    })
    // console.log(this.userOpenid)
    await this.getuserInfo();
    await this.getPartnerInfo();
    // await this.unlockPartner();
  },
  // ***********接口*********** //
  //cloud 封装
  async initcloud() {
    wx.cloud.init({
      traceUser: true,
      env: '' // 替换成你自己的环境id
    })
    this.cloud = () => {
      return wx.cloud 
    }
  },
  //database 封装
  async database() {
    return (await this.cloud()).database();
  },
  //获取用户OpenId接口封装
  async getOpenId() {
    const {
      result: {
        openid,
        fromopenid
      }
    } = await (await this.cloud()).callFunction({
      name: 'getOpenId'
    }).catch(e => {
      let flag = e.toString()
      flag = flag.indexOf('FunctionName') == -1 ? flag : "网络服务异常，请确认网络重新尝试！"
      wx.hideLoading()
      wx.showModal({
        content: flag, 
        showCancel: false
      })
      throw new Error(flag)
    })
    if (openid !== "") return openid
    return fromopenid
  },

  // ***********功能*********** //
  //功能性的全局函数
  async getuserInfo(){

    const db = await this.database();
    db.collection('UP-users').where({
      openid:this.userOpenid
    }).get().then(res => {
      if (res.data[0]){
        wx.setStorageSync('userInfo', res.data[0]);
      }else{
        db.collection(getApp().globalData.users).add({
          data:{
            openid:this.userOpenid,
            avatarUrl:'cloud://cloud1-7g8auzu50049a843.636c-cloud1-7g8auzu50049a843-1324748818/user.png',
            nickName:'习惯仔',
            partner:'',
            des:'多多指教啊~',
            relatedIcon:1.00, //单次 // 单位 元
            taskStatus:0,  //0 表示昨天没有任务，1 表示昨天有任务且未完成，2 表示昨天有任务且已完成
            toBePaid:0,
            cate:['普适',""],
            userPersonality:[0,[0,0,0,0,0,0]]
            // income:0  // 单次，是习惯费用的0.5%
          }
        })
        wx.setStorageSync('userInfo',{
          avatarUrl:'cloud://cloud1-7g8auzu50049a843.636c-cloud1-7g8auzu50049a843-1324748818/user.png',
          nickName:'习惯仔',
          partner:'',
          des:'多多指教啊~',
          relatedIcon:1.00, 
          taskStatus:0,
          toBePaid:0,
          cate:['普适',""],
          userPersonality:[0,[0,0,0,0,0]]
        })
      }
    })
  },
  async getPartnerInfo() {
    const db = await this.database();
    db.collection('UP-users').where({
        partner:this.userOpenid
      }).get().then(res=>{
        if (res.data[0]){
          wx.setStorageSync('partnerInfo', res.data[0]);
        }
      })
  },
  // 跳转类
    // 跳转到
  async ledgerUpdate(e){  //传入数据即可，直接更新
  },
});
