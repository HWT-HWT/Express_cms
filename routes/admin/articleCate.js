const express = require('express')
const {getUnix} = require('../../model/tools')
const ArticleCateModel = require('../../model/articleCateModel')
const  mongoose = require('../../model/core')

var routes = express.Router()

routes.get('/',async(req,res)=>{
  var result = await ArticleCateModel.aggregate([
    {
      $lookup:{
        from:'article_cate',
        localField:'_id',
        foreignField:'pid',
        as:'items'
      }
    },
    {
      $match:{
        pid:'0'
      }
    }
  ])
  
   res.render('admin/articleCate/index.html',{
    list:result
   })
})

routes.get('/add',async(req,res)=>{
    var topCateList = await ArticleCateModel.find()

    res.render('admin/articleCate/add.html',{
        cateList:topCateList
    })

 })

 routes.post('/doAdd',async(req,res)=>{
   try {
    if(req.body.pid != 0) {
      req.body.pid = new mongoose.Types.ObjectId(req.body.pid)
     }
     req.body.add_time = getUnix()
  
     var result  = new ArticleCateModel(req.body)
     await result.save()
     res.redirect(`/${req.app.locals.adminPath}/articleCate`)
   } catch (error) {
      res.render('admin/public/error.html',{
        'redirectUrl':`/${req.app.locals.adminPath}/articleCate/add?id=${req.body.id}`,
        'message':'修改失败'
      })
   }
 })

 routes.get('/edit',async(req,res)=>{
  var id = req.query.id
  var result = await ArticleCateModel.find({"_id":id})
  var tocateList = await ArticleCateModel.find({"pid":'0'})
  
  res.render('admin/articleCate/edit.html',{
    list:result[0],
    cateList:tocateList
  })
  
})

routes.post('/doEdit',async(req,res)=>{
  try {

    if (req.body.pid != 0) { 
      req.body.pid =new mongoose.Types.ObjectId(req.body.pid)
    }
    
    await ArticleCateModel.updateOne({'_id':req.body.id},req.body)

    res.redirect(`/${req.app.locals.adminPath}/articleCate`)
    
  } catch (error) {
    res.render('admin/public/error.html',{
      'redirectUrl':`/${req.app.locals.adminPath}/articleCate/edit?id=${req.body.id}`,
        'message':'修改失败 '
    })
  }
})


routes.get('/delete',async(req,res)=>{
  try {
    var result = await ArticleCateModel.find({'pid':new mongoose.Types.ObjectId(req.query.id)})

    console.log(!result.length>0);
    
    
    if (!result.length>0) {
      await ArticleCateModel.deleteOne({'_id':req.query.id})

      res.render('admin/public/success.html',{
        'redirectUrl':`/${req.app.locals.adminPath}/articleCate`,
          'message':'删除成功 '
      })
    }else{
      res.render('admin/public/error.html',{
        'redirectUrl':`/${req.app.locals.adminPath}/articleCate`,
          'message':'先删除子类 '
      })
    }
  } catch (error) {
    res.render('admin/public/error.html',{
      'redirectUrl':`/${req.app.locals.adminPath}/articleCate/edit?id=${req.body.id}`,
        'message':'修改失败 '
    })
  }
})

module.exports  = routes