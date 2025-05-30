const mongoose = require('./core')
// 创建  
var ManagerSchema = mongoose.Schema({
    username:{type:String},
    password:{type:String},
    email:{type:String},
    mobile:{type:String},
    status:{type:String,default:1},
    login_time:{type:Number},
    add_time:{type:Number}
})

module.exports = mongoose.model('Manager',ManagerSchema,'manager')