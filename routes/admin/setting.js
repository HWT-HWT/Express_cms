const express = require('express')
const { multer } = require('../../model/tools')
const setting = require('../../model/settingModel')

var routes = express.Router()

routes.get('/', async (req, res) => {
    // 查找数据
    var result = await setting.find({})
    // 跳转传产
    res.render('admin/setting/index.html', {
        list: result[0]
    })
})

//提交修改 
routes.post('/doEdit', multer().fields([{ name: 'site_logo', maxCount: 1 }, { name: 'no_picture', maxCount: 1 }]), async (req, res) => {
    // 创建空对象
    var json = {}
    // 是否有名“site_logo” 的图片
    if (req.files.site_logo) {
        // 修改字符串
        let site_logo = { "site_logo": req.files.site_logo[0].path.slice(7) }
        // 添加到创建的空对象
        json = Object.assign(json, site_logo)
    }
    // 是否有名“no_picture” 的图片
    if (req.files.no_picture) {
        // 修改字符串
        let no_picture = { "no_picture": req.files.no_picture[0].path.slice(7) }
        // 添加到创建的空对象
        json = Object.assign(json, no_picture)
    }
    // 修改setting数据库中全部的值
    await setting.updateMany({}, Object.assign(json, req.body))
    // 跳转
    res.redirect(`/${req.app.locals.adminPath}/setting`)
})


module.exports = routes