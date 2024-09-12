// pages/home/index.js
const { formatTime } = require('../../util/Js-toolKit/formatTime');

Page({
  skip_partner(){
    wx.navigateTo({
      url: '../partner/index',
    })
  },
  skip_all_habits(){
    wx.navigateTo({
      url: '../allHabits/index',
    })
  },
  skip_bank(){
    wx.navigateTo({
      url: '../bank/index',
    })
  },
  data: {
    bulbSwitch:true,
    func:[
      "Habit",
      "Keeping",
      "Partner",
      "Profit"
    ]

  },
  switch() {
    this.setData({
      bulbSwitch:!this.data.bulbSwitch
    })
  },
  onLoad(options) {

  },
  onShow() {
    if (typeof this.getTabBar==='function' && this.getTabBar()){
      this.getTabBar().setData({
        nowSelected:0
      })
    }
    let time = parseInt(formatTime(new Date).slice(11,13));
    if (time >= 12 && time < 18){
      this.setData({
        time: "Afternoon!"
      })
    }else if (time >= 0 && time <=11){
      this.setData({
        time: "Morning!"
      })
    }else {
      this.setData({
        time: "Evening!"
      })
    }

  },
  onShareAppMessage() {

  }
})