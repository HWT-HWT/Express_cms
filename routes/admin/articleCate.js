const express = require('express')
const {getUnix} = require('../../model/tools')
const ArticleCateModel = require('../../model/articleCateModel')
const ArticleModel = require('../../model/article')
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
    console.log(req.body);
    
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
    
    if (!result.length>0) {
      
      var Article = await ArticleModel.find({'cid':new mongoose.Types.ObjectId(req.query.id)})

      console.log(Article,'查找子类');
      

      if (Article.length>0) {
        res.render('admin/public/error.html',{
          'redirectUrl':`/${req.app.locals.adminPath}/articleCate`,
            'message':'当前分类下面有文章信息无法删除'
        })
      }else{
        await ArticleCateModel.deleteOne({'_id':req.query.id})

        res.render('admin/public/success.html',{
          'redirectUrl':`/${req.app.locals.adminPath}/articleCate`,
            'message':'删除成功 '
        })
      }

      

    }else{
      res.render('admin/public/error.html',{
        'redirectUrl':`/${req.app.locals.adminPath}/articleCate`,
          'message':'该分类下有次级分类无法删除'
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