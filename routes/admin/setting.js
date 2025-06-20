const express = require('express')
const {multer} = require('../../model/tools')
const setting = require('../../model/settingModel')

var routes = express.Router()

routes.get('/',async(req,res)=>{

    var result  = await setting.find({})
    res.render('admin/setting/index.html',{
        list:result[0]
    })
    // console.log(result);
    
})
routes.post('/doEdit',multer().fields([{name:'site_logo',maxCount:1},{name:'no_picture',maxCount:1}]),async(req,res)=>{
    var json={}
    if (req.files.site_logo) {
        let site_logo = {"site_logo":req.files.site_logo[0].path.slice(7)}
        json=Object.assign(json,site_logo)
    }
    
    if (req.files.no_picture) {
        let no_picture = {"no_picture":req.files.no_picture[0].path.slice(7)}
        json=Object.assign(json,no_picture)
    }

    console.log(Object.assign(json,req.body));
    
    
    await setting.updateMany({},Object.assign(json,req.body))

    res.redirect(`/${req.app.locals.adminPath}/setting`)
})


module.exports  = routes