// 引入express
const express = require('express')
// 引入自定义模块
const { multer, getUnix } = require('../../model/tools')
// 引入操作表 articleCateModel
const articleCateModel = require('../../model/articleCateModel')
// 引入操作表 articleModel
const articleModel = require('../../model/article')
// 引入fs模块
const fs = require('fs')

// 创建路由实例
var routes = express.Router()

// 该url:/admin/article

routes.get('/', async (req, res) => {
  // 获取路由传参 ##用于切换分页
  var page = req.query.page || 1
  // 设置一页显示多少行
  var pageSize = 2;

  // var result = await articleModel.find({}).skip((page-1)*pageSize).limit(pageSize)

  // 筛选条件 用于筛选
  var json = {}

  var result = await articleModel.aggregate([
    // 聚合管道 关联两个表
    {
      // articleModel表中cid 和 目标表(article_cate)中 _id 关联 在articleModel下的cate保存 目标表对于的全部内容
      $lookup: {
        // 设置需要关联的表名
        from: 'article_cate',
        // 当前集合的关联字段
        localField: 'cid',
        // 目标集合的关联字段
        foreignField: '_id',
        // 输出数组字段名
        as: 'cate'
      }
    },
    {
      // 设置筛选条件
      $match: json
    },
    {
      // 设置升序还是倒叙
      $sort: { 'sort': -1 }
    },
    {
      // 跳过指定数量
      $skip: (page - 1) * pageSize
    },
    {
      // 限制返回数量
      $limit: pageSize
    }
  ])

  // 获取表中有多少数据
  var count = await articleModel.countDocuments()

  // 跳转携带参数
  res.render('admin/article/index', {
    list: result, // 当前页数据列表
    totaPages: Math.ceil(count / pageSize),
    page: page //全部页数
  })
})

routes.get('/add', async (req, res) => {
  // 聚合articleCate与article_cate 且将article_cate内容放入items
  var result = await articleCateModel.aggregate([
    {
      $lookup: {
        from: 'article_cate',
        localField: '_id',
        foreignField: 'pid',
        as: 'items'
      }
    },
    {
      $match: {
        pid: '0'
      }
    }
  ])
  // 跳转携带参数
  res.render('admin/article/add.html', {
    articleCate: result
  })
})

routes.post('/doAdd', multer().single('article_img'), async (req, res) => {
  // 获取图片保存位置
  var imgSrc = req.file ? req.file.path.slice(7) : ''

  //  创建时间戳
  req.body.add_time = getUnix()

  // 传入图片保存位置
  var articleAdd = articleModel(Object.assign(req.body, { article_img: imgSrc }))
  // 保存数据
  await articleAdd.save()
  // 跳转页面
  res.redirect(`/${req.app.locals.adminPath}/article`)

})

//富文本图片保存 
routes.post('/doUploadImage', multer().single('file'), async (req, res) => {
  // 获取保存地址 且删除前七个字符
  var imgSrc = req.file ? req.file.path.slice(7) : ''
  // 页面输出地址
  res.send({
    link: '/' + imgSrc
  })
})

routes.get('/edit', async (req, res) => {
  // 获取传参
  var id = req.query.id;
  // 查找数据库
  var articleResult = await articleModel.find({ '_id': id })
  // 聚合管道
  var cateResult = await articleCateModel.aggregate([
    {
      $lookup: {
        from: 'article_cate',
        localField: '_id',
        foreignField: 'pid',
        as: 'items'
      }
    },
    {
      // 筛选
      $match: {
        pid: '0'
      }
    }
  ])
  // 跳转 传参
  res.render('admin/article/edit.html', {
    articleCate: cateResult,
    list: articleResult[0]
  })
})


routes.post('/doEdit', multer().single('article_img'), async (req, res) => {
  try {
    // 提交修改时携带图片参数 操作
    if (req.file) {
      // 获取文件地址 
      var imgSrc = req.file ? req.file.path.slice(7) : ''
      // 修改 图片地址放入数据中   
      await articleModel.updateOne({ "_id": req.body.id }, Object.assign(req.body, { 'article_img': imgSrc }))
    } else {
      // 没有修改图片直接提交
      await articleModel.updateOne({ "_id": req.body.id }, req.body)
    }
    // 提示
    res.render('admin/public/success.html', {
      'redirectUrl': `/${req.app.locals.adminPath}/article`,
      'message': '修改成功 '
    })
  } catch (error) {
    // 报错
    res.render('admin/public/error.html', {
      'redirectUrl': `/${req.app.locals.adminPath}/edit?id=${res.body._id}`,
      'message': '修改失败'
    })
  }
})

routes.get('/delete', multer().single('article_img'), async (req, res) => {
  try {
    //  查找数据
    var resultList = await articleModel.find({ '_id': req.query.id })
    // 删除数据
    var result = await articleModel.deleteOne({ '_id': req.query.id })
    // 删除成功后的操作
    if (result.acknowledged) {
      // 删除对应图片
      fs.unlink('static/' + resultList[0].article_img, (err) => {
        console.log('删除成功' + err);
      })
    }
    // 提示
    res.render('admin/public/success.html', {
      'redirectUrl': `/${req.app.locals.adminPath}/article`,
      'message': '删除成功'
    })

  } catch (error) {
    // 报错
    res.render('admin/public/error.html', {
      'redirectUrl': `/${req.app.locals.adminPath}/article`,
      'message': '删除失败'
    })
  }

})

module.exports = routes