const express = require('express')
const { multer } = require('../../model/tools')
const FocusModel = require('../../model/focusModel') 
const fs = require('fs')

var routes = express.Router()

routes.get('/', async (req,res)=>{

    var result = await FocusModel.find({})

    res.render('admin/focus/index.html',{
        list:result
    })
})

routes.get('/add', async (req,res)=>{
    res.render('admin/focus/add.html')
})

routes.post('/doAdd', multer().single('focus_img'), async (req,res)=>{
    
    var focus_img = req.file ? req.file.path.slice(7) : ''    

    var result = new FocusModel(Object.assign(req.body,{ 'focus_img' : focus_img}))

    await result.save()

    res.redirect(`/${req.app.locals.adminPath}/focus`)
    
})

routes.get('/delete', async (req,res)=>{
    
    var resultList = await FocusModel.find({'_id':req.query.id})

    var result = await FocusModel.deleteOne({ _id: req.query.id})
    
    if(result.acknowledged){

        if (resultList[0].focus_img) {
            fs.unlink('static/'+resultList[0].focus_img,(err)=>{
                console.log(err);
            })
        }
       
    }

    res.render('admin/public/success.html',{
        'redirectUrl':`/${req.app.locals.adminPath}/focus`,
         'message':'删除成功'
    })
})

routes.get('/edit', async (req,res)=>{
    
   var result =  await FocusModel.find({ _id:req.query.id})
   
   res.render('admin/focus/edit.html',{
        list:result[0]
   })
   
})

routes.post('/doEdit', multer().single('focus_img'),async (req,res)=>{
    try {
        
        var resultList = await FocusModel.find({'_id':req.body.id})

        if (req.file) {
            var focus_img = req.file ? req.file.path.slice(7) : ''

            const update = await FocusModel.updateOne({'_id':req.body.id},Object.assign(req.body,{'focus_img':focus_img}))

            if(update.acknowledged){
                if (resultList[0].focus_img) {
                    fs.unlink('static/'+resultList[0].focus_img,(err)=>{
                        console.log(err);
                    })
                }
               
            }

        }else{
            await FocusModel.updateOne({'_id':req.body.id},req.body)
        }

        res.render('admin/public/success.html',{
            'redirectUrl':`/${req.app.locals.adminPath}/focus`,
            'message':'修改成功'
        })

    } catch (error) {

        res.render('admin/public/error.html?id='+req.body.id,{
            'redirectUrl':`/${req.app.locals.adminPath}/focus`,
            'message':'修改数据失败'
        })

    }
})


module.exports  = routes