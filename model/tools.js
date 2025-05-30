// 引入包
const multer = require('multer')
const path = require('path')
const sd = require('silly-datetime')
const { mkdirp } = require('mkdirp')

// 创建方法
const tools = {

  multer() {
    const storage = multer.diskStorage({
      destination: async(req, file, cb)=>{

        let day = sd.format(new Date(),'YYYYMMDD')

        let dir =  path.join("/static/upload",day)
              
        await mkdirp(__dirname+dir)

        //保存路径 上传前必须目录
        cb(null, __dirname+dir)
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

  }
}

module.exports = tools



