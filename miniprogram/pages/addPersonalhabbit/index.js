// pages/addPersonalhabbit/index.js
const { formatTime } = require('../../util/Js-toolKit/formatTime')
Page({
  data: {
    habitName:'',
    writeTarget:false,
    target:"",
    date_2:"",
    weekDay:['日', '一', '二', '三', '四', '五', '六'],
    controlKey:[1,-1.5,1,-1.5,1,-1.5,1],
    points: new Array(7).fill(null).map(() => ({ active: false })),
    time:25,
    freq:0,
    finished:"未完成"
  },
  bindNamechange(e){
    this.setData({
      habitName:e.detail.value
    })
    // console.log(this.data.habitName)
  },
  changeAreavisible(){
    this.setData({
      writeTarget:true
    })
  },
  bindSubmit(e){
    this.setData({
      target:e.detail.value,
      writeTarget:false
    })
  },
  onDateChange_1(e){
    let time_1 = e.detail.value
    if (time_1 < this.data.date_1){
      wx.showToast({
        title: '一生中没有过去',
        icon:'error'
      })
      return
    }
    this.setData({
      date_1:time_1
    })
  },
  onDateChange_2(e){
    let time_2 = e.detail.value
    if (time_2 < this.data.date_1) {
      wx.showToast({
        title: '小于前置日期',
        icon:'error'
      })
      return
    }
    this.setData({
      date_2:time_2
    })
  },
  activatePoint: function(e) {
    const index = e.currentTarget.dataset.index;
    // Toggle the active state of the clicked point
    const points = this.data.points.map((point, idx) => {
      if (idx === index) point.active = !point.active;
      return point;
    });

    this.setData({ points });
  },
  slideChange_time(e){
    this.setData({
      time:e.detail.value
    })
  },
  checkbox_Change_freq(e){
    if (e.detail.value.length > 0){
      this.setData({
        freq:1,
        finished:"已完成"
      })
    }else {
      this.setData({
        freq:0,
        finished:"未完成"
      })
    }
    console.log(this.data.freq)
  },
  reset(){
    // this.data.points.forEach(point => {
    //   point.active = true
    // });
    this.setData({
      habitName:'',
      target:'',
      date_1:formatTime(new Date).slice(0,10),
      date_2:'',
      points:new Array(7).fill(null).map(() => ({ active: false })),
      time:25,
      freq:0,
      finished:"未完成"
    })
  },
  async save(){
    const activeIndexes = this.data.points.reduce((acc, point, idx) => {
      if (point.active) acc.push(idx);
      return acc;
    }, []);
    if (this.data.habitName === ''){
      wx.showToast({
        title: '习惯名称未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.date_2 === ''){
      wx.showToast({
        title: '终止日期未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (activeIndexes.length == 0){
      wx.showToast({
        title: '未进行日程安排',
        icon: 'error',
        duration: 2000
      })
      return
    }
    const db = await getApp().database()
    let data = this.data
    db.collection(getApp().globalData.habits).add({
      data: {
        founder:getApp().userOpenid,
        partner:'',
        habitName:data.habitName,
        target:data.target,
        date_1:data.date_1,
        date_2:data.date_2,
        points:activeIndexes,
        time:data.time,
        freq:data.freq,
        is_Pub:false,
        init:"0"
      }
    }).then(() => {
      wx.showModal({
        title: '保存成功~',
        content: '返回？取消则继续添加',
        complete: (res) => {
          if (res.cancel) {
            this.reset()
          }
          if (res.confirm) {
            wx.navigateBack({
              delta: 0,
            })
          }
        }
      })
    })
  },
  onLoad(options) {
    this.setData({
      date_1:formatTime(new Date).slice(0,10)
    })
    // console.log(this.data.nowTime )
  },
  onShow() {

  },
  onShareAppMessage() {

  }
})