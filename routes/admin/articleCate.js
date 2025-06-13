const express = require('express')
const {getUnix} = require('../../model/tools')
const ArticleCateModel = require('../../model/articleCateModel')
const  mongoose  = require('../../model/core')

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

 routes.post('/doAdd',async(req,res)=>{
   if(req.body.pid != 0) {
    req.body.pid = new mongoose.Types.ObjectId(req.body.pid)
   }
   req.body.add_time = getUnix()

   var result  = new ArticleCateModel(req.body)
   await result.save()
   res.redirect(`/${req.app.locals.adminPath}/articleCate`)
 })

module.exports  = routes