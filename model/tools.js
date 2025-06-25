// 引入包
const multer = require('multer')
// 引入path模块
const path = require('path')
// 引入silly-datetime包 ##三方包 用于处理时间
const sd = require('silly-datetime')
// 引入mkdirp包
const { mkdirp } = require('mkdirp')

// 创建方法
const tools = {
  // 此方法获取上传的文件
  multer() {
    const storage = multer.diskStorage({
      destination: async(req, file, cb)=>{
        // 修改文件名为时间戳
        let day = sd.format(new Date(),'YYYYMMDD')
        // 拼接保存字符串 ##保存文件地址
        let dir =  path.join("static/upload",day)
        // 此方法需要异步调用 ##传入文件放置地址
        await mkdirp(dir)

        //保存路径 上传前必须目录
        cb(null,dir)
      },
      filename: function (req, file, cb) {
        // 获取后缀名
        let extname = path.extname(file.originalname)
        // 修改文件名
        cb(null, Date.now() + extname)
      }
    })
    var upload = multer({ storage: storage })

    return upload
  },
  md5() {

  },
  getUnix(){
    // 获取时间戳
    const time = new Date()
    return time.getTime()
  },
  formatTime(unixStr){
    // 获取时间戳
    let day = sd.format(unixStr,'YYYY-MM-DD')
    return day
  }
}

module.exports = tools



