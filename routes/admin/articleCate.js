const express = require('express')
const { getUnix } = require('../../model/tools') // 时间戳方法
const ArticleCateModel = require('../../model/articleCateModel')
const ArticleModel = require('../../model/article')
const mongoose = require('../../model/core')

var routes = express.Router()

routes.get('/', async (req, res) => {
  // 聚合管道
  var result = await ArticleCateModel.aggregate([
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
  res.render('admin/articleCate/index.html', {
    list: result
  })
})

routes.get('/add', async (req, res) => {
  // 查找数据
  var topCateList = await ArticleCateModel.find()
  // 跳转 传参
  res.render('admin/articleCate/add.html', {
    cateList: topCateList
  })

})

routes.post('/doAdd', async (req, res) => {
  try {
    // 筛选出顶级分类以外的数据
    if (req.body.pid != 0) {
      // 转换数据
      req.body.pid = new mongoose.Types.ObjectId(req.body.pid)
    }
    //  创建时间戳
    req.body.add_time = getUnix()
    //  创建数据
    var result = new ArticleCateModel(req.body)
    await result.save()
    // 跳转传参
    res.redirect(`/${req.app.locals.adminPath}/articleCate`)
  } catch (error) {
    // 报错
    res.render('admin/public/error.html', {
      'redirectUrl': `/${req.app.locals.adminPath}/articleCate/add?id=${req.body.id}`,
      'message': '修改失败'
    })
  }
})

routes.get('/edit', async (req, res) => {
  // 获取id
  var id = req.query.id
  // 查找数据
  var result = await ArticleCateModel.find({ "_id": id })
  // 查找顶级分类
  var tocateList = await ArticleCateModel.find({ "pid": '0' })
  // 携带参数
  res.render('admin/articleCate/edit.html', {
    list: result[0],
    cateList: tocateList
  })

})
// 提交修改的操作
routes.post('/doEdit', async (req, res) => {
  try {
    // 顶级分类以外数据将pid转换
    if (req.body.pid != 0) {
      req.body.pid = new mongoose.Types.ObjectId(req.body.pid)
    }
    // 提交修改
    await ArticleCateModel.updateOne({ '_id': req.body.id }, req.body)
    // 跳转
    res.redirect(`/${req.app.locals.adminPath}/articleCate`)
  } catch (error) {
    // 报错
    res.render('admin/public/error.html', {
      'redirectUrl': `/${req.app.locals.adminPath}/articleCate/edit?id=${req.body.id}`,
      'message': '修改失败 '
    })
  }
})

// 删除
routes.get('/delete', async (req, res) => {
  try {
    // 查找全部pid不是0的 (顶级分类)
    var result = await ArticleCateModel.find({ 'pid': new mongoose.Types.ObjectId(req.query.id) })
    // 操作不是顶级分类
    if (!result.length > 0) {
      // 在查找cid
      var Article = await ArticleModel.find({ 'cid': new mongoose.Types.ObjectId(req.query.id) })
      console.log(Article, '查找子类');
      // 如果查出则是有子类
      if (Article.length > 0) {
        // 提示
        res.render('admin/public/error.html', {
          'redirectUrl': `/${req.app.locals.adminPath}/articleCate`,
          'message': '当前分类下面有文章信息无法删除'
        })
      } else {
        // 删除操作
        await ArticleCateModel.deleteOne({ '_id': req.query.id })
        res.render('admin/public/success.html', {
          'redirectUrl': `/${req.app.locals.adminPath}/articleCate`,
          'message': '删除成功 '
        })
      }
    } else {
      // 报错
      res.render('admin/public/error.html', {
        'redirectUrl': `/${req.app.locals.adminPath}/articleCate`,
        'message': '该分类下有次级分类无法删除'
      })
    }
  } catch (error) {
    // 报错
    res.render('admin/public/error.html', {
      'redirectUrl': `/${req.app.locals.adminPath}/articleCate/edit?id=${req.body.id}`,
      'message': '修改失败 '
    })
  }
})

module.exports = routes