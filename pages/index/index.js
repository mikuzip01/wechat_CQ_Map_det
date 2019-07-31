const uploadFileUrl = 'https://127.0.0.1'  //yoursite是你申请的域名。


  Page({
    data: {
      imageSrc: null,
    },
    chooseImage: function () {  //绑定的chooseImage控件
      var that = this
      wx.chooseImage({ // 选定图片
        sourceType: ['camera', 'album'],
        sizeType: ['compressed'],  //这里选择压缩图片
        count: 1,
        success: function (res) {
          console.log(res)
          that.setData({
            imageSrc: res.tempFilePaths[0]
          })
        }
      })
    },
    check: function (e) {  // 绑定的check button
      var that = this
      wx.uploadFile({  // 上传图片
        url: uploadFileUrl,
        name: 'picture',
        filePath: that.data.imageSrc,
        formData: {
          'user': 'test'
        },
        success: function (res) {
          console.log('imageSrc is:', that.data.imageSrc)
          console.log('uploadImage success, res is:', res)
          wx.showModal({
            title: "图片详情",
            content: res.data,
            showCancel: false,
            confirmText: "确定"
          })
        },
        fail: function ({ errMsg }) {
          console.log('uploadImage fail, errMsg is', errMsg)
        }
      })
    },
    reload: function (e) {  // 绑定的reload button
      this.setData({
        imageSrc: null
      })
    }
  })