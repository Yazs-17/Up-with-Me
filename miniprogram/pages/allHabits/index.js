// pages/allHabits/index.js
Page({
  data: {

  },
  onShow() {
    this.loadHabits()
  },

  async loadHabits(){
    const db = await getApp().database()
    db.collection(getApp().globalData.habits).where({
      _openid:getApp().userOpenid
    }).get().then(res=>{
      const {
        data
      } = res
      this.setData({
        habits:data
      })
    })
  },

  skip_checck_habit(e){
    let id = e.currentTarget.dataset.id
    // console.log(this.data.pub_Habit_sured[id].habit_id)
    wx.navigateTo({
      url: '../editHabit/index?status=1&id=' + this.data.habits[id]._id,
    })
  },

  onHide() {

  }
})