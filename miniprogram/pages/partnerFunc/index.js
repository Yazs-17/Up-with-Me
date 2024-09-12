// pages/partnerFunc/index.js
const { formatTime } = require('../../util/Js-toolKit/formatTime')
const { getWeekDay } = require('../../util/Js-toolKit/getWeekDay')
Page({
  skip_partner(){
    wx.navigateTo({
      url: '../partnerStatus/index',
    })
  },
  skip_to_tomato(e){
    // console.log(e.currentTarget.dataset.time)
    wx.navigateTo({
      url: '../tomatoClock/index?time=' + e.currentTarget.dataset.time + "&title=" + e.currentTarget.dataset.title + "&disabled=1&id=" + e.currentTarget.dataset._id,
    })
  },
  pri_skip_to_tomato(e){
    // console.log(e.currentTarget.dataset.time)
    wx.navigateTo({
      url: '../tomatoClock/index?disabled=2&time=' + e.currentTarget.dataset.time + "&title=" + e.currentTarget.dataset.title + "&id=" + e.currentTarget.dataset._id,
    })
  },
  skipFindpartner(){
    wx.navigateTo({
      url: '../partnerFind/index',
    })
  },
  changeIS_ADD(){
    this.setData({
      is_add:!this.data.is_add
    })
  },
  addPublichabit(){
    wx.showModal({
      title: '添加共同习惯',
      content: '具体习惯将从个人习惯库中选择',
      complete: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '../addPublichabit/index',
          })
        }
      }
    })
  },
  skip_checck_habit(e){
    let id = e.currentTarget.dataset.id
    // console.log(this.data.pub_Habit_sured[id].habit_id)
    console.log(this.data)
    wx.navigateTo({
      url: '../editHabit/index?status=1&id=' + this.data.habits[id]._id,
    })
  },
  addPersonalhabbit(){
    wx.showModal({
      title: '独立习惯添加',
      content: '独立使用，时间自定',
      complete: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '../addPersonalhabbit/index',
          })
        }
      }
    })
  },
  data: {
    writeTarget:false,
    partnerInfo:wx.getStorageSync('partnerInfo'),
    is_add:false,
    navItems:['共同习惯修炼','个人习惯培养'],
    now_nav_index:0,
    words:"一句习惯，便是一句承诺"
  },
  changeIndex(e){
    let itemIndex = e.currentTarget.dataset.index
    this.setData({
      now_nav_index:itemIndex
    })
  },
  Loadshiju() {
    let that = this
    wx.request({
      url: 'https://v1.jinrishici.com/all',
      method:'GET',
      dataType:'json',
      success:function(res) {
        that.setData({
          words:res.data.content
        })
      },
      fail:function(e) {
        wx.showToast({
          title: '请求网路失败',
          icon:'error'
        })
      }
    })
  },
  onShow() {
    this.Loadshiju()
    let partnerStatus  = wx.getStorageSync('partnerInfo') ? 0 : 1;
    if (typeof this.getTabBar==='function' && this.getTabBar()){
      this.getTabBar().setData({
        nowSelected:1,
        partnerStatus:partnerStatus
      })
    }
    this.loadHabits()
  },
  async loadHabits(){
    const db = await getApp().database()
    db.collection(getApp().globalData.habits).where({
      _openid:getApp().userOpenid
    }).get().then(res => {
      // console.log(res.data)
      const {
        data
      } = res
      let pub_habit = data.filter(habit => habit.partner != '');
      let now_time = formatTime(new Date);
      let cnt = 0;
      let weekday = getWeekDay()
      pub_habit.forEach(habit => {
        console.log(habit)
        if (now_time >= habit.date_1 && now_time <= habit.date_2 && !habit.freq && habit.points.includes(weekday)) {
          habit.freq = 0
          cnt++
        }else {
          habit.freq = 1
        }
      });
      this.setData({
        habits:data,
        pub_habit: pub_habit,
        pri_habit: data.filter(habit => habit.partner == ''),
        // now_time:formatTime(new Date)
        cnt:cnt
      })
      console.log(this.data.pub_habit)
      // console.log(this.data.now_time)
    })
  },
  onHide() {

  },
  onUnload() {

  },
  onShareAppMessage() {

  }
})