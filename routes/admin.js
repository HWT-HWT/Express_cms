const express = require('express')
const routes = express.Router()
const url = require('url')


routes.use((req,res,next)=>{

    var pathname = url.parse(req.url).pathname

    console.log(pathname);
    
    if (req.session.userinfo && req.session.userinfo.username) {

        next()

    }else{
    //    if(pathname == '/login' || pathname == '/login/doLogin' || pathname == '/login/verify'){
    //         next()
    //    }else{
    //     res.redirect(`/${req.app.locals.adminPath}/login`)
    //    }
    next()
    }
    
})

const setting = require('./admin/setting')
const article = require('./admin/article')
const articleCate = require('./admin/articleCate')
const user = require('./admin/user')
const login = require('./admin/login')
const nav = require('./admin/nav')
const manager  = require('./admin/manager')
const focus  = require('./admin/focus')
const main  = require('./admin/main')


routes.use('/',main)
routes.use('/focus',focus)
routes.use('/user',user)
routes.use('/login',login)
routes.use('/nav',nav)
routes.use('/manager',manager)
routes.use('/articleCate',articleCate)
routes.use('/article',article)  
routes.use('/setting',setting)   

module.exports  = routes