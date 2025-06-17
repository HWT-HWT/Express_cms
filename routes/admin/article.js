const express = require('express')
const {multer} = require('../../model/tools')
const articleCateModel = require('../../model/articleCateModel')

var routes = express.Router()

routes.get('/',async(req,res)=>{
   res.render('admin/article/index.html',{
     list:[]
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
  console.log(req.field);
  
  var imgSrc = req.file ? req.file.path.slice(7) : ''
  console.log(imgSrc);
  console.log(req.body);
  res.send('执行增加')
  
})

 routes.post('/doUploadImage',multer().single('file'),async(req,res)=>{
  console.log(req.field);
  
  var imgSrc = req.file ? req.file.path.slice(7) : ''
  res.send({
    link:'/'+imgSrc
  })
})




module.exports  = routes