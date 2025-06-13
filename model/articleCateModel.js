const mongoose = require('./core')

let Schema = mongoose.Schema;

let ArticleCateSchema = mongoose.Schema({
    title:{type:String},
    link:{type:String},
    pid:{type:Schema.Types.Mixed},
    sub_title:{type:String}, //seo优化
    keywords:{type:String}, //seo优化
    description:{type:String}, //seo优化
    status:{type:String,default:1},   
    sort:{type:Number,default:100},
    add_title:{type:Number}
})

module.exports = mongoose.model('ArticleCate',ArticleCateSchema,'article_cate')
