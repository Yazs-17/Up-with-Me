Component({
  properties: {

  },
  data: {
    nowSelected:1,
    partnerStatus:0,
    "tablist":[
      {
        "tabPath":"../home/index",
        "text":"Home",
        "icontext":"H"
      },
      {
        "tabPath": "../partnerFunc/index",
        "text": [
          "Habit",
          "Unfud",
        ]
      },
      {
        "tabPath":"../user/index",
        "text":"You",
        "icontext":"Y"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    skipTab(e){
      const { index,tab } = e.currentTarget.dataset;
      if(this.data.nowSelected==index || index==undefined) return;
      // if(this.data.centerStatus==2){
      //   wx.showToast({
      //     title: '请登录哦~',
      //     icon:"loading"
      //   })
      //   return;
      // }
      wx.switchTab({
        url:tab,
      })
    }
  }
})