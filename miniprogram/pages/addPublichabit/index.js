// pages/addPublichabit/index.js
Page({
  skipAddPublichabit(){
    wx.redirectTo({
      url: '../addPersonalhabbit/index',
    })
  },
  skipeditHabit(e){
    let index = e.currentTarget.dataset.index
    if (this.data.privateHabits[index].is_Pub){
      return
    }
    // console.log(this.data.privateHabits[index])
    wx.navigateTo({
      url: '../editHabit/index?id='+this.data.privateHabits[index]._id,
    })
  },
  data: {

  },
  async onShow() {
    const userOpenid = getApp().userOpenid;
    const db = await getApp().database()
    db.collection(getApp().globalData.habits).where({
      _openid: userOpenid,
      partner:''
    }).get().then(res => {
      const {
        data
      } = res
      this.setData({
        privateHabits:data.filter(habit => habit.partner == '')
      })
    })
  },
  async add_pub(e){
    // console.log(this.data.privateHabits)
    const habitIndex = e.currentTarget.dataset.index
    const habit_id = this.data.privateHabits[habitIndex]._id
    const openid = wx.getStorageSync('partnerInfo').openid
    const habit_name = this.data.privateHabits[habitIndex].habitName
    const habit_target = this.data.privateHabits[habitIndex].target
    const db = await getApp().database()
    // let that = this
    db.collection(getApp().globalData.habits).where({
      _id:habit_id
    }).update({
      data:{
        is_Pub:true
      }
    })
    this.data.privateHabits[habitIndex].is_Pub = true
    this.setData({
      privateHabits:this.data.privateHabits
    })
    db.collection(getApp().globalData.msg).add({
      data:{
        target:openid,
        habit_id:habit_id,
        cate:1,  //cate 取值 {1, 2, 3}
        habit_name:habit_name,
        habit_target:habit_target
      }
    })
  },
  async del_pri(e){
    const habitIndex = e.currentTarget.dataset.index
    const habit = this.data.privateHabits[habitIndex]._id
    const db = await getApp().database()
    db.collection(getApp().globalData.habits).where({
      _id: habit
    }).remove()
    this.data.privateHabits.splice(habitIndex,1)
    this.setData({
      privateHabits:this.data.privateHabits
    })
  },
  onPullDownRefresh() {

  },
  onReachBottom() {

  },
})