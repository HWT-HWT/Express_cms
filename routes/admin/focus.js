const express = require('express')

var routes = express.Router()

routes.get('/', async (req,res)=>{
    res.render('admin/focus/index.html',{
        list:[1,2]
    })
})

routes.get('/add', async (req,res)=>{
    res.send('添加轮播图')
})

module.exports  = routes