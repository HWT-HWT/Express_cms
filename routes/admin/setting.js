const express = require('express')
const {multer} = require('../../model/tools')
const setting = require('../../model/settingModel')

var routes = express.Router()

routes.get('/',async(req,res)=>{
    var result  = await setting.find({})
    res.render('admin/setting/index.html',{
        list:result[0]
    })
    console.log(result);
    
})
routes.post('/doEdit',async(req,res)=>{
    res.send('123')
})


module.exports  = routes