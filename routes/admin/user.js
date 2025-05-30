const express = require('express')
const tools = require('../../model/tools')

var routes = express.Router()

routes.get('/',(req,res)=>{
    res.send('用户列表')
})

routes.get('/add',(req,res)=>{
    res.render('admin/user/add')
})

let cpUpload = tools.multer().fields([{name:'pic1',maxCount:1},{name:'pic2',maxCount:1}])

routes.post('/doadd',cpUpload,(req,res)=>{
    res.send({
        body:req.body,
        files:req.files
    })
})



module.exports  = routes