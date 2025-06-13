const express = require('express')
const {getUnix} = require('../../model/tools')
const ArticleCateModel = require('../../model/articleCateModel')

var routes = express.Router()

routes.get('/',(req,res)=>{
   var result = []
   res.render('admin/articleCate/index.html',{
    list:result
   })
})

routes.get('/add',async(req,res)=>{
    var topCateList = await ArticleCateModel.find({'pid':'0'})

    res.render('admin/articleCate/add.html',{
     cateList:topCateList
    })

 })

 routes.get('/doAdd',async(req,res)=>{
   
 })

module.exports  = routes