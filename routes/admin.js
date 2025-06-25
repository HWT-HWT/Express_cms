const express = require('express')
const routes = express.Router()
const url = require('url')

// 判断是否登录
routes.use((req,res,next)=>{
    // 获取url
    var pathname = url.parse(req.url).pathname
    // 是否req.session.userinfo 和 req.session.userinfo.username 都存在
    if (req.session.userinfo && req.session.userinfo.username) {
        // 跳转下一步
        next()
    }else{
         // 如果访问的url是登录页或者提交登录页跟获取验证页时运行下一步操作
    //    if(pathname == '/login' || pathname == '/login/doLogin' || pathname == '/login/verify'){
    //         next()
    //    }else{
           // 跳转登录页
    //     res.redirect(`/${req.app.locals.adminPath}/login`)
    //    }
    next()
    }
    
})
// 获取
const setting = require('./admin/setting')
const article = require('./admin/article')
const articleCate = require('./admin/articleCate')
const user = require('./admin/user')
const login = require('./admin/login')
const nav = require('./admin/nav')
const manager  = require('./admin/manager')
const focus  = require('./admin/focus')
const main  = require('./admin/main')

// 设置中间件
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