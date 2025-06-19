const express = require('express')
const {multer} = require('../../model/tools')
const articleCateModel = require('../../model/articleCateModel')
const articleModel = require('../../model/article')
const fs = require('fs')

var routes = express.Router()

routes.get('/',async(req,res)=>{

  var page = req.query.page || 1

  var pageSize = 2;

  // var result = await articleModel.find({}).skip((page-1)*pageSize).limit(pageSize)

  var json={}

  var result = await articleModel.aggregate([
    {
      $lookup:{
        from:'article_cate',
        localField:'cid',
        foreignField:'_id',
        as:'cate'
      }
    },
    { 
      $match:json
    },
    {
      $sort:{'add_time':-1}
    },
    {
      $skip:(page-1)*pageSize
    },
    {
      $limit:pageSize
    }
  ])
  
  console.log(result);
  
  var count = await articleModel.find({})
  
   res.render('admin/article/index.html',{
     list:result,
     totaPages:Math.ceil(count.length/pageSize),
     page:page
  })
})

routes.get('/add',async(req,res)=>{
  var result = await articleCateModel.aggregate([
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
    
    res.render('admin/article/add.html',{
      articleCate:result
    })
 })

 routes.post('/doAdd',multer().single('article_img'),async(req,res)=>{
  
  var imgSrc = req.file ? req.file.path.slice(7) : ''

  var articleAdd = articleModel(Object.assign(req.body,{article_img:imgSrc}))

  await  articleAdd.save()

  console.log(articleAdd);
  console.log(imgSrc);
  console.log(req.body);
  res.redirect(`/${req.app.locals.adminPath}/article`)
  
})

 routes.post('/doUploadImage',multer().single('file'),async(req,res)=>{
  console.log(req.query.id);
  
  var imgSrc = req.file ? req.file.path.slice(7) : ''

  res.send({
    link:'/'+imgSrc
  })
})

routes.get('/edit',async(req,res)=>{

  var id = req.query.id;

  var articleResult = await articleModel.find({'_id':id})

  var cateResult = await articleCateModel.aggregate([
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

    console.log(articleResult);
    console.log(cateResult);
    
    res.render('admin/article/edit.html',{
      articleCate:cateResult,
      list:articleResult[0]
    })
 })


 routes.post('/doEdit',multer().single('article_img'),async(req,res)=>{
  try {
   
    if (req.file) {
       var imgSrc = req.file ? req.file.path.slice(7) : ''
       await articleModel.updateOne({"_id":req.body.id},Object.assign(req.body,{'article_img':imgSrc}))
    }else{
      await articleModel.updateOne({"_id":req.body.id},req.body)
    }
    res.render('admin/public/success.html',{
      'redirectUrl':`/${req.app.locals.adminPath}/article`,
        'message':'修改成功 '
    })
  } catch (error) {
    res.render('admin/public/error.html',{
      'redirectUrl':`/${req.app.locals.adminPath}/edit?id=${res.body._id}`,
        'message':'修改失败'
    })
  }
  
 })

 routes.get('/delete',multer().single('article_img'),async(req,res)=>{
  try {

    var resultList= await articleModel.find({'_id':req.query.id})

    var result =  await articleModel.deleteOne({'_id':req.query.id})

    if (result.acknowledged) {
      fs.unlink('static/'+resultList[0].article_img,(err)=>{
        console.log(err);
      })
    }
    
    res.render('admin/public/success.html',{
      'redirectUrl':`/${req.app.locals.adminPath}/article`,
        'message':'删除成功'
    })
   
  } catch (error) {
    res.render('admin/public/error.html',{
      'redirectUrl':`/${req.app.locals.adminPath}/article`,
        'message':'删除失败'
    })
  }
  
 })

module.exports  = routes