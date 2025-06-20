const express = require('express')
const FocusModel = require('../model/focusModel')
const NavModel = require('../model/NavModel')
const url = require('url')
var routes = express.Router()

routes.use(async(req,res,next)=>{

    var pathname = url.parse(req.url).pathname
    
    var NavResult = await NavModel.find({position:2}).sort({'sort':1})

    req.app.locals.navList =NavResult

    req.app.locals.pathname =pathname

    next()
})

routes.get('/', async(req,res)=>{
    var focusResult = await FocusModel.find({'type':1}).sort({'sort':-1})
    var focusResult = await FocusModel.find({'type':1}).sort({'sort':-1})

    res.render('default/index.html',{
        focusList:focusResult
    })
})

routes.get('/overview',(req,res)=>{
    res.render('default/overview.html',{
        focusList:[]
    })
})

routes.get('/news',(req,res)=>{
    res.render('default/news.html',{
        focusList:[]
    })
})

routes.get('/services',(req,res)=>{
    res.render('default/services.html',{
      focusList:[]
    })
})

routes.get('/contact',(req,res)=>{
    res.render('default/contact.html',{
        focusList:[]
    })
})


module.exports  = routes