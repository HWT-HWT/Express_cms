const express = require('express')
const {getUnix} = require('../../model/tools')
const NavModel = require('../../model/NavModel')

var routes = express.Router()

routes.get('/', async (req,res)=>{
    let result = await NavModel.find({})
    console.log(result);
    
    res.render('admin/nav/index.html',{
        list:result
    })
    
})

routes.get('/add', async (req,res)=>{
    res.render('admin/nav/add.html')
})



routes.post('/doAdd', async (req,res)=>{
//   var title = req.body.title;
//   var link = req.body.link;
//   var position = req.body.position;
//   var is_opennew = req.body.is_opennew;
//   var sort = req.body.sort;
//   var status = req.body.status;

 var result =  new NavModel(Object.assign(req.body,{add_time:getUnix()}))

    

    try {
        await result.save()

        res.render('admin/public/success.html',{
            'redirectUrl':'/admin/nav',
            'message':'增加数据成功'
        })
    } catch (error) {
        res.render('admin/public/error.html',{
            'redirectUrl':'/admin/nav',
            'message':'增加数据失败'
        })
    }

})

routes.get('/Edit',async(req,res)=>{

   var result =  await NavModel.find({"_id":req.query.id})

   console.log(result);

   if ( result.length < 0) return
   
    res.render('admin/nav/edit.html',{
        list:result[0]
    })
})

routes.post('/doEdit', async (req,res)=>{
     try {
        var result =  await NavModel.updateOne({"_id":req.body.id},req.body)
        res.render('admin/public/success.html',{
            'redirectUrl':'/admin/nav',
            'message':'修改数据成功'
        })
     } catch (error) {
        res.render('admin/public/error.html?id='+req.body.id,{
            'redirectUrl':'/admin/nav',
            'message':'修改数据失败'
        })
     }
    
})

routes.get('/delete',async(req,res)=>{

   
    
    try {
        var result =  await NavModel.deleteOne({"_id":req.query.id})
        res.render('admin/public/success.html',{
            'redirectUrl':'/admin/nav',
            'message':'删除数据成功'
        })
    } catch (error) {
        res.render('admin/public/error.html?id='+req.body.id,{
            'redirectUrl':'/admin/nav',
            'message':'修改数据失败'
        })
    }
})

module.exports  = routes