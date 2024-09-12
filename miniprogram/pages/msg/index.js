// pages/wxCase/sticky/index.js
const { formatTime } = require('../../util/Js-toolKit/formatTime')
Page({
  data: {
    navList: ['共同习惯添加确认', '好友申请','好友警告'],
    //navList: ['共同习惯修炼', '自我习惯修炼'],
    nav_type: 0,
    isFixed: false,
    navTop: 0,
  },
  async sure_add_f(e){
    let index = e.currentTarget.dataset.index
    let yourpartner = this.data.pub_Habit_sured[index].founderOpenid
    const db = await getApp().database()
    db.collection(getApp().globalData.users).where({
      openid:yourpartner
    }).update({
      data:{
        partner:"sjb"
      }
    })
    db.collection(getApp().globalData.users).where({
      openid:"sjb"
    }).update({
      data:{
        partner:yourpartner
      }
    })
    let _id = this.data.pub_Habit_sured[index]._id
    db.collection(getApp().globalData.msg).where({
      _id:_id
    }).remove()
    this.data.pub_Habit_sured.splice(index,1)
    this.setData({
      pub_Habit_sured:this.data.pub_Habit_sured
    })
    getApp().onLaunch()
    wx.showToast({
      title: '绑定成功~',
    })
    setTimeout(()=>{
      wx.reLaunch({
        url: '../start/index',
      })
    },500)
    
    // console.log(this.data.pub_Habit_sured[e.currentTarget.dataset.index])
  },
  async leave_alone_f(e){
    let index = e.currentTarget.dataset.index
    let _id = this.data.pub_Habit_sured[index]._id
    const db = await getApp().database()
    db.collection(getApp().globalData.msg).where({
      _id:_id
    }).remove()
    this.data.pub_Habit_sured.splice(index,1)
    this.setData({
      pub_Habit_sured:this.data.pub_Habit_sured
    })
  },
  skip_checck_habit(e){
    let id = e.currentTarget.dataset.id
    // console.log(this.data.pub_Habit_sured[id].habit_id)
    wx.navigateTo({
      url: '../editHabit/index?status=1&id=' + this.data.pub_Habit_sured[id].habit_id,
    })
  },
  async sure_add(e){
    // console.log(e.currentTarget.dataset.index)
    let add_index = e.currentTarget.dataset.index
    let id = this.data.pub_Habit_sured[add_index]._id
    let target = this.data.pub_Habit_sured[add_index].habit_id
    console.log(target)
    let openid = getApp().userOpenid
    // console.log(openid)
    const db = await getApp().database()
    db.collection(getApp().globalData.habits).where({
      _id:target
    })
    .update({
      data:{
        partner:"sjb"
      }
    })
    this.data.pub_Habit_sured.splice(add_index,1)
    this.setData({
      pub_Habit_sured:this.data.pub_Habit_sured
    })
    db.collection(getApp().globalData.msg).where({
      _id:id
    }).remove()
  },
  async leave_alone(e){
    let add_index = e.currentTarget.dataset.index
    let id = this.data.pub_Habit_sured[add_index]._id
    let habit_id = this.data.pub_Habit_sured[add_index].habit_id
    const db = await getApp().database()
    db.collection(getApp().globalData.habits).where({
      _id:habit_id
    }).update({
      data:{
        is_Pub:false,
        partner:''
      }
    })
    this.data.pub_Habit_sured.splice(add_index,1)
    this.setData({
      pub_Habit_sured:this.data.pub_Habit_sured
    })
    db.collection(getApp().globalData.msg).where({
      _id:id
    }).remove()
  },
  // 载入数据
  async onShow(){
    if (!wx.getStorageSync('partnerInfo')){
      wx.showModal({
        title: '您还没有伙伴哦~',
        showCancel:false,
        complete: (res) => {
          if (res.confirm) {
            this.setData({
              nav_type:1
            })
          }
        }
      })
    }
    const target = getApp().userOpenid
    const db = await getApp().database()
    db.collection(getApp().globalData.msg).where({

      // 注意，理应是这个target，但是在调试的时候先用
      target:wx.getStorageSync('partnerInfo').openid
      // 

    }).get().then(res => {
      const {
        data
      } = res
      console.log(data)
      this.setData({
        pub_Habit_sured:data
      })
      // console.log(this.data.partner_sured)
    })
  },
  changeType(e) {
    let { index } = e.currentTarget.dataset;
    if (this.data.nav_type == index || index == undefined) return;
    this.setData({
      nav_type: index
    })
    if (this.data.isFixed) {
      wx.pageScrollTo({
        selector: '#content',
        duration: 0.5
      })
    }
  },
  onReady() {
    wx.createSelectorQuery().select("#nav").boundingClientRect((rect) => {
      if (rect && rect.top) {
        this.setData({
          navTop: parseInt(rect.top)
        })
      }
    }).exec()
    this.setData({
      now_time:formatTime(new Date).slice(0,10)
    })
  },
  onPageScroll(e) {
    let scrollTop = parseInt(e.scrollTop),
      isFixed = scrollTop >= this.data.navTop;
    if (this.data.isFixed !== isFixed) {
      this.setData({
        isFixed
      })
    }
  }

})