const express = require('express')
const tools = require('../../model/tools')
const NavModel = require('../../model/NavModel')

var routes = express.Router()

routes.get('/',(req,res)=>{
    res.send('导航列表')
})

routes.get('/add', async (req,res)=>{

   try {
    
    var result =  new NavModel({
        title:'首页',
        url:'www.itying.com'
    })

    await result.save()

    res.send('增加导航成功')

   } catch (error) {
    console.log(error);
   }



    // res.render('admin/nav/add')
})

routes.get('/Edit',(req,res)=>{
    res.send('修改导航')
})

routes.post('/doadd', tools.multer().single('pic'),(req,res)=>{
    res.send({
        body:req.body,
        file:req.file
    })
})


routes.post('/doEdit',(req,res)=>{
    res.send('执行修改导航')
})

module.exports  = routes