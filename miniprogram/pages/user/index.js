// pages/user/index.js
Page({
  //功能module
  clickActive(e){
    let { index } = e.currentTarget.dataset;
    if (this.data.currIndex == index || index == undefined ) return;
    this.setData({
      currIndex:index
    })
  },
  showMenu(){
    this.setData({
      show_menu:!this.data.show_menu,
      currIndex:'',
      menuEnterchosen:'选择'
    })
  },
  skip_yiyan(){
    wx.navigateTo({
      url: '../oneSentence/index',
    })
  },
  changeBG(){
  },
  skip_userInfoReality(){
    wx.navigateTo({
      url: '../userPersonality/index',
    })
  },
  exit_to_start(){
    wx.showModal({
      title: '返回开始页面？',
      complete: (res) => {
        if (res.confirm) {
          wx.reLaunch({
            url: '../start/index',
          })
        }
      }
    })
  },
  checkPartner(){
    wx.navigateTo({
      url: '../partner/index',
    })
  },
  skip_msg(){
    wx.navigateTo({
      url: '../msg/index',
    })
  },
  skip_xinxi(){
    wx.navigateTo({
      url: '../userXinxi/index',
    })
  },
  data: {
    userInfo:wx.getStorageSync('userInfo'),
    partnerInfo:wx.getStorageSync('partnerInfo'),
    partnerVisiblle:false,
    menu:[
      {
        funcName:'skip_yiyan',
        name:'一言'
      },
      {
        funcName:'skip_xinxi',
        name:'信息'
      },
      {
        funcName:'skip_userInfoReality',
        name:'特征'
      },
      {
        funcName:'skip_msg',
        name:'私信'
      },
      {
        funcName:'exit_to_start',
        name:'Exit'
      },
      {
        funcName:'checkPartner',
        name:'同伴'
      },
    ],
    currIndex:'', //
    show_menu:true,  //
    menuEnterchosen:'进入菜单',
  },
  get_2_Info(){
    this.setData({
      partnerVisiblle:!this.data.partnerVisiblle
    })
  },
  onLoad(options) {
    
  },
  onShow() {
    // 

    // tabBar刚需
    if (typeof this.getTabBar==='function' && this.getTabBar()){
      this.getTabBar().setData({
        nowSelected:2,
      })
    }
  },
  onShareAppMessage() {

  }
})