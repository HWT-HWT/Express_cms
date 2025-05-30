const express = require('express')

var routes = express.Router()

// 后台管理页面
routes.get('/',(req,res)=>{
    res.render('admin/main/index.html')

})


routes.get('/welcome',(req,res)=>{
    res.send('欢迎来到后台管理中心')
})



module.exports  = routes