const mongoose = require('./core')

let settingSchema = mongoose.Schema({
    site_title:{type:String},
    site_logo:{type:String},
    site_keywords:{type:String},
    no_picture:{type:String},
    site_icp:{type:String},
    site_tel:{type:String},
    serch_keywords:{type:String},
    code:{type:String},
    site_desciption:{type:String},
    tongjs_code:{type:String},
})

module.exports = mongoose.model('Setting',settingSchema,'setting')