// 连接数据库
const mongoose = require('mongoose')
const config = require('../config/config')

mongoose.connect(config.dbUrl)


module.exports = mongoose