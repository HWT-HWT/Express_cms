const express = require('express')
// const MonagerModel = require('../../model/maagerModel')

var routes = express.Router()

routes.get('/',async (req,res)=>{
       res.render('admin/manager/index.html')
})

routes.get('/add', async(req,res)=>{
    res.render('admin/manager/edit.html')
})


module.exports  = routes