const mongoose = require('./core')

let Schema = mongoose.Schema;

let ArticleSchema = mongoose.Schema({
    title:{type:String},
    cid:{type:Schema.Types.ObjectId},
    article_img:{type:String}, //seo优化
    keywords:{type:String}, //seo优化
    description:{type:String}, //seo优化
    content:{type:String},   
    autor:{type:String},
    click_count:{type:String},
    is_hot:{type:Number},
    is_best:{type:Number},
    is_new:{type:Number},
    sort:{
        type:Number,
        default:100
    },
    status:{
        type:Number,
        default:1
    },
    add_time:{
        type:Number
    }
})

module.exports = mongoose.model('Article',ArticleSchema,'article')
