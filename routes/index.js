const express = require('express')
const FocusModel = require('../model/focusModel')
const NavModel = require('../model/NavModel')
const articleModel = require('../model/article')
const articleCateModel = require('../model/articleCateModel')
const mongoose = require('../model/core')
const {formatTime} =require('../model/tools')
const url = require('url')
var routes = express.Router()

routes.use(async (req, res, next) => {
    
    var pathname = url.parse(req.url).pathname

    var NavResult = await NavModel.find({ position: 2 }).sort({ 'sort': 1 })

    req.app.locals.navList = NavResult

    req.app.locals.pathname = pathname

    // 添加全局方法 时间戳转换时间
    req.app.locals.formatTime = formatTime;


    next()
})

routes.get('/', async (req, res) => {
    var focusResult = await FocusModel.find({ 'type': 1 }).sort({ 'sort': -1 })

    var topResult = await articleModel.find({'cid':new mongoose.Types.ObjectId('685caf45d6a3a54748a2d4c0')},'title').limit(4).sort({'sort':-1})

    var  StatusResult = await articleModel.find({'status':1}).limit(4).sort({'sort':-1})

    console.log(StatusResult);
    
    res.render('default/index.html', {
        focusList: focusResult,
        topResult,
        StatusResult
    })
})

routes.get('/overview', (req, res) => {
    res.render('default/overview.html', {
        focusList: []
    })
})

routes.get('/news', async (req, res) => {

    var id = req.query.id

    var page = req.query.page || 1

    var pageSize = 2;

    var json = {}

    if(id){
        var cateResult = await articleCateModel.find({'pid': new mongoose.Types.ObjectId(id)})
    }else{
        var cateResult = await articleCateModel.find({})
    }

  

    var tempArr = [];
    
    cateResult.forEach((value) => {
        tempArr.push(value._id)
    })

    json = Object.assign(json, {
        'cid': { $in: tempArr }
    })

    var result = await articleModel.aggregate([
        {
            $lookup: {
                from: 'article_cate',
                localField: 'cid',
                foreignField: '_id',
                as: 'cate'
            }
        },
        {
            $match: json
        },
        {
            $sort: {'sort': -1 }
        },
        {
            $skip: (page - 1) * pageSize
        },
        {
            $limit: pageSize
        }
    ])

    var count = await articleModel.countDocuments(json)
    

    res.render('default/news.html', {
        newslist: result,
        totaPages: Math.ceil(count/pageSize),
        page: page
    })
})

routes.get('/services', async(req, res) => {
    
    // var list1 = await articleCateModel.aggregate([
    //     {
    //         $lookup: {
    //             from: 'article',
    //             localField: '_id',
    //             foreignField: 'cid',
    //             as: 'articeList'
    //         }
    //     },
    //     {
    //         $match: {'pid': new mongoose.Types.ObjectId('685cde3500cfefe289dd548b')}
    //     },
    //     {
    //         $sort:{'sort':-1}
    //     }
    // ])

    var list1 = await articleModel.find({'cid':new mongoose.Types.ObjectId('685ce3e15ea2187dc385f2c7')},'title link')
    var list2 = await articleModel.find({'cid':new mongoose.Types.ObjectId('685cf814f6abdf31b52cbb3d')},'title link')
    var list3 = await articleModel.find({'cid':new mongoose.Types.ObjectId('685cf9b14c9f184912d8de05')},'title link')
    var list4 = await articleModel.find({'cid':new mongoose.Types.ObjectId('685cf915d666beda14025f27')},'title link')
    var list5 = await articleModel.find({'cid':new mongoose.Types.ObjectId('685cfa64b1d5c52d66202511')},'title link')
    var list6 = await articleModel.find({'cid':new mongoose.Types.ObjectId('685cfad6846f8ac0b6920f3e')},'title link')
    
    
    res.render('default/services.html', {
        list1,
        list2,
        list3,
        list4,
        list5,
        list6
    })
})

routes.get('/contact', (req, res) => {
    res.render('default/contact.html', {
        focusList: []
    })
})

routes.get('/content_:id.html', async(req, res) => {
    var id = req.params.id

    var result = await articleModel.find({'_id':id})

    res.render('default/new_content.html', {
        list: result[0]
    })
})



module.exports = routes