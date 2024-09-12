// index.js
import {
  formatTime
} from '../../util/Js-toolKit/formatTime'

Page({
  data: {
    time: '25', //分钟
    mTime: 1500000, //毫秒
    timeStr: '25:00',
    rate: '',
    isClock: false,
    timer: null,
    playShow: true, //暂停按钮切换
    clockText: '习惯养成', //番茄页任务名称显示
    is_disabled:true //默认不可更改
  },
  onLoad(e) {
    console.log(e)
    if (e != undefined) {
      if (e.disabled == "2"){  //对个人习惯的跳转
        this.setData({
          is_disabled:false
        })
      }
      this.setData({
        time:e.time,
        mTime:e.time*60*1000,
        timeStr:parseInt(e.time) >= 10 ? e.time + ":00" : "0" + e.time + ":00",
        clockText: e.title,
        id:e.id
      })
    }
    let res = wx.getSystemInfoSync()
    let rate = 750 / res.windowWidth
    this.setData({
      rate
    })
  },
  slideChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  buttonChange(e) {
    this.saveData()
  },
  saveData() {
    this.setData({
      isClock: true,
      mTime: this.data.time * 60 * 1000, //ms
      timeStr: parseInt(this.data.time) >= 10 ? this.data.time + ":00" : "0" + this.data.time + ":00"
    })
    this.drawCircle()
    this.drawActive()
  },
  // 倒计时画圆圈
  drawCircle() {
    const lineWidth = 6 / this.data.rate; //px
    const query = wx.createSelectorQuery()
    query.select('#circle')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)
        ctx.lineCap = 'round'
        ctx.lineWidth = "lineWidth"
        ctx.beginPath()
        ctx.arc(400 / this.data.rate / 2, 400 / this.data.rate / 2, 400 / this.data.rate / 2 - 2 * lineWidth, 0, 2 * Math.PI, false)
        ctx.strokeStyle = "#ffffff"
        ctx.stroke()
      })
  },
  drawActive() {
    let _this = this
    var timer = setInterval(() => {
      let angle = 1.5 + 2 * (_this.data.time * 60 * 1000 - _this.data.mTime) / (_this.data.time * 60 * 1000);
      let currentTime = _this.data.mTime - 100
      _this.setData({
        mTime: currentTime
      })
      if (angle < 3.5) {
        if (currentTime % 1000 == 0) {
          var timeStr1 = currentTime / 1000; //s
          var timeStr2 = parseInt(timeStr1 / 60); //m
          var timeStr3 = (timeStr1 - timeStr2 * 60) >= 10 ? (timeStr1 - timeStr2 * 60) : "0" + (timeStr1 - timeStr2 * 60);
          var timeStr2 = timeStr2 >= 10 ? timeStr2 : "0" + timeStr2;
          _this.setData({
            timeStr: timeStr2 + ":" + timeStr3
          })
        };
        const lineWidth = 6 / _this.data.rate; //px
        const query = wx.createSelectorQuery()
        query.select('#circle_active')
          .fields({
            node: true,
            size: true
          })
          .exec((res) => {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = res[0].width * dpr
            canvas.height = res[0].height * dpr
            ctx.scale(dpr, dpr)
            ctx.lineCap = 'round'
            ctx.lineWidth = "lineWidth"
            ctx.beginPath()
            ctx.arc(400 / _this.data.rate / 2, 400 / _this.data.rate / 2, 400 / _this.data.rate / 2 - 2 * lineWidth, 1.5 * Math.PI, angle * Math.PI, false)
            ctx.strokeStyle = "#E7624F"
            ctx.stroke()
          })
      } else {
        //计时完成时
        wx.showModal({
          title: '提示',
          content: '当前计时已完成，将跳转回主界面',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#FA8072',
          success(res) {
            if (res.confirm) {
              // 对相应习惯的两个数据的更改，一个是完成日期，另一个是完成的状态
              this.onFinished()
            }
          }
        })
        clearInterval(timer);
      }
    }, 100)
    _this.setData({
      timer: timer
    })
  },
  async onFinished(){
    const db = await getApp().database()
    db.collection(getApp().globalData.habits).where({
      _id:this.data.id
    }).update({
      data: {
        freq:1,
        init:formatTime(new Date).slice(0,10)
      }
    })
  },
  // 暂停按钮
  handlePause() {
    clearInterval(this.data.timer);
    this.setData({
      playShow: false
    })
  },
  //播放按钮
  handlePlay() {
    this.drawActive()
    this.setData({
      playShow: true
    })
  },
  //中止按钮
  handleSuspend() {
    clearInterval(this.data.timer);
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确定中止任务吗？当前计时会立刻停止，并返回主界面',
      confirmColor: '#FA8072',
      success(res) {
        if (res.confirm) {
          _this.setData({
            isClock: false,
            playShow: true
          })
        } else if (res.cancel) {
          _this.drawActive()
        }
      }
    })
  },
  onHide() {
    this.handlePause()
  },
  onUnload() {
    this.handlePause()
  }
})
