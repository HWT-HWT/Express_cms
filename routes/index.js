const express = require('express')
const FocusModel = require('../model/focusModel')
const NavModel = require('../model/NavModel')
const articleModel = require('../model/article')
const articleCateModel = require('../model/articleCateModel')
const mongoose = require('../model/core')
const url = require('url')
var routes = express.Router()

routes.use(async (req, res, next) => {

    var pathname = url.parse(req.url).pathname

    var NavResult = await NavModel.find({ position: 2 }).sort({ 'sort': 1 })

    req.app.locals.navList = NavResult

    req.app.locals.pathname = pathname

    next()
})

routes.get('/', async (req, res) => {
    var focusResult = await FocusModel.find({ 'type': 1 }).sort({ 'sort': -1 })

    res.render('default/index.html', {
        focusList: focusResult
    })
})

routes.get('/overview', (req, res) => {
    res.render('default/overview.html', {
        focusList: []
    })
})

routes.get('/news', async (req, res) => {

    var page = req.query.page || 1

    var pageSize = 2;

    var json = {}

    var cateResult = await articleCateModel.find({'pid': new mongoose.Types.ObjectId('6858ed4d5d16d3e63437aa9e') })

    console.log(cateResult);

    var tempArr = [];
    
    cateResult.forEach((value) => {
        tempArr.push(value._id)
    })

    json = Object.assign(json, {
        'cid': { $in: tempArr }
    })
    console.log(tempArr);
    
    console.log(json);

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
            $sort: { 'add_time': -1 }
        },
        {
            $skip: (page - 1) * pageSize
        },
        {
            $limit: pageSize
        }
    ])

    var count = await articleModel.countDocuments(json)

    console.log(count,result);

    res.render('default/news.html', {
        newslist: result,
        totaPages: Math.ceil(count/pageSize),
        page: page
    })
})

routes.get('/services', (req, res) => {
    res.render('default/services.html', {
        focusList: []
    })
})

routes.get('/contact', (req, res) => {
    res.render('default/contact.html', {
        focusList: []
    })
})


module.exports = routes