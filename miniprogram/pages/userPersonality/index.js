// pages/userPersonality/index.js
let userInfo = wx.getStorageSync('userInfo')
Page({
  data: {
    // userPersonality:[0,[0,0,0,0,0]],  
    //云端传入
    personalityItems:[
      {
        name: "1.外向性(Extraversion)",
        points: [
          "✿ 喜欢社交活动的程度 (3分)",
          "✿ 在群体中的活跃程度 (3分)",
          "✿ 喜欢独处还是与人相处 (4分)"
        ]
      },
      {
        name: "2.宜人性 (Agreeableness)",
        points: [
          "✿ 同情心水平 (3分)",
          "✿ 合作与和谐的倾向 (3分)",
          "✿ 对他人感受的敏感程度 (4分)"
        ]
      },
      {
        name: "3.尽责性(Conscientiousness)",
        points: [
          "✿ 组织和计划能力 (3分)",
          "✿ 自我纪律和责任感 (3分)",
          "✿ 对细节的关注程度 (4分)"
        ]
      },
      {
        name: "4.开放性(Openness to Experience)",
        points: [
          "✿ 尝试新事物和新想法的愿望 (3分)",
          "✿ 创造性和想象力 (3分)",
          "✿ 对艺术和美的欣赏 (4分)"
        ]
      },
      {
        name: "5.学习性(learnability)",
        points: [
          "✿ 对知识和技能提升的兴趣- (3分)",
          "✿ 自我提升和成长的动力 (3分)",
          "✿ 对挑战的接受程度 (4分)"
        ]
      },
      {
        name: "6.灵活性(flexibility)",
        points: [
          "✿ 对变化的适应能力 (3分)",
          "✿ 在不同情境下的应对策略 (3分)",
          "✿ 对新环境和新人群的适应速度 (4分)"
        ]
      }
    ],
    habitCate:[
      "运动",
      "普适",
      "学习",
      "读书",
      "养生",
      "休息"
    ],
    value_habit:[2],
    selected_habit:""
  },
  async all_submit(){
    let cate = [this.data.myCate,this.data.selected_habit]
    const db = await getApp().database()
    db.collection(getApp().globalData.users).where({
      openid:getApp().userOpenid
    }).update({
      data:{
        cate:cate,
        userPersonality:this.data.userPersonality
      }
    })
    wx.showToast({
      title: '更改成功',
      icon:'success'
    })
    userInfo.cate = cate
    userInfo.userPersonality = this.data.userPersonality
    wx.setStorageSync('userInfo', userInfo)
  },
  bindSliderchange(e){
    // target  =>  userPersonality[1]
    // console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    // console.log(e.detail.value)
    this.data.userPersonality[1][index] = e.detail.value
    this.setData({
      userPersonality:this.data.userPersonality
    })
    // console.log(this.data.userPersonality)
  },
  bindhabitChange(e){
    // console.log(e.detail.value[0])
    this.setData({
      selected_habit:this.data.habits[e.detail.value[0]]._id
    })
    console.log(this.data.selected_habit)
  },
  bindcateChange(e){
    this.setData({
      myCate:this.data.habitCate[e.detail.value[0]]
    })
    console.log(this.data.myCate)
  },
  onLoad(options) {
    
  },
  onShow() {
    let myCate = userInfo.cate[0]
    let value = [].push(this.data.habitCate.findIndex(e => e===myCate)+1)
    let userPersonality = userInfo.userPersonality
    if (!userPersonality[0]) {
      userPersonality[0] = 1
    }
    this.setData({
      myCate:myCate,
      value:value,
      userPersonality:userPersonality
    })
    // console.log(this.data.value)
    this.loadHabits()

  },
  async loadHabits() {
    const db = await getApp().database()
    db.collection(getApp().globalData.habits).where({
      openid:getApp().userOpenid
    }).get().then(res=>{
      // console.log(res)
      const {
        data
      } = res
      // console.log(data)
      this.setData({
        habits:data
      })
    })
  }
})