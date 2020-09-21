//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '所属区域：',
    value: 'unknown',
    p1: 0,
    p2: 0,
    resurl: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    img_arr: [],
    condition: false,
  },

  objectValueNotNone: function (obj) {  // 判断对象是否为空
    for (var objKey in obj) {
      if (!obj[objKey]) {
        return false;
      }
    }
    return true;
  },

  //事件处理函数
  bindViewTap: function() {
    var that = this //！！！！！！！！！“搭桥”

    //利用API从本地读取一张图片
    wx.chooseImage({
      count: 1,
      //sizeType: ['original', 'compressed'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        //将读取的图片替换之前的图片
        that.setData({
          userImage: tempFilePaths[0],
          img_arr: that.data.img_arr.concat(tempFilePaths[0]),
          condition: false,
        }) //通过that访问
        console.log(that.data.userImage)
      }
    })
  },
  changeName: function(e) {
    this.setData({
      value: "xiao",
    })

  },
  upload: function() {
    var that = this
    // loading检测结果，这里加上mask防止用户重复点击，目前设定的超时时间为30秒
    wx.showLoading({
      title: '位置信息检测中',
      mask: true
    });
    setTimeout(function () {
      wx.hideLoading()
    }, 30000)
    wx.uploadFile({
      url: 'http://127.0.0.1:443/postdata',
      // url: 'https://mikuzip01.zicp.io:443/postdata',
      // filePath: that.data.img_arr[0],
      filePath: that.data.userImage,
      name: 'content',
      // formData: adds,
      success: function(res) {
        console.log(res.data);
        if(JSON.parse(res.statusCode) == 200){
          that.setData({
            value: JSON.parse(res.data)['value'],
            userImage: JSON.parse(res.data)['resurl'],
            resurl: JSON.parse(res.data)['resurl'],
            p1: JSON.parse(res.data)['p1'],
            p2: JSON.parse(res.data)['p2']
          })
  
          if (res) {
            wx.showToast({
              title: '检测完成！',
              duration: 3000
            });
          }
        
          that.setData({
            condition:true,
          })
        }
        else{
          wx.showToast({
            title: '后台忙，请重新提交',
            icon: "none",
            duration: 3000
          });
        }
        
      }
    })
    this.setData({
      formdata: ''
    })
  },
  takePhoto() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      //sizeType: ['original', 'compressed'],
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({
          userImage: res.tempFilePaths[0],

        })
        console.log("res.tempImagePath" + tempFilePaths[0])
      }
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //点击事件  
  // clickImg: function (e) {
  //   var imgUrl = this.data.resurl;
  //   if (this.data.condition==true){
  //     wx.previewImage({
  //       urls: [imgUrl], //需要预览的图片http链接列表，注意是数组
  //       current: '', // 当前显示图片的http链接，默认是第一个
  //       success: function (res) { },
  //       fail: function (res) { },
  //       complete: function (res) { },
  //     })
  //   }
  // }

})