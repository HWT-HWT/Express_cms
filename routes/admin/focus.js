const express = require('express')
const { multer } = require('../../model/tools')
const FocusModel = require('../../model/focusModel') 
const fs = require('fs')

var routes = express.Router()

routes.get('/', async (req,res)=>{
    // 查找
    var result = await FocusModel.find({})
    res.render('admin/focus/index.html',{
        list:result
    })
})

routes.get('/add', async (req,res)=>{
    // 跳转
    res.render('admin/focus/add.html')
})

routes.post('/doAdd', multer().single('focus_img'), async (req,res)=>{
    // 保存图片地址
    var focus_img = req.file ? req.file.path.slice(7) : ''    
    // 数据添加图片地址 保存数据
    var result = new FocusModel(Object.assign(req.body,{ 'focus_img' : focus_img}))
    await result.save()
    // 跳转
    res.redirect(`/${req.app.locals.adminPath}/focus`)
})

routes.get('/delete', async (req,res)=>{
    // 查找数据
    var resultList = await FocusModel.find({'_id':req.query.id})
    // 删除数据
    var result = await FocusModel.deleteOne({ _id: req.query.id})
    // 数据删除成功在删除对应的图片
    if(result.acknowledged){
        if (resultList[0].focus_img) {
            fs.unlink('static/'+resultList[0].focus_img,(err)=>{
                console.log(err);
            })
        }
    }
    // 提示删除成功
    res.render('admin/public/success.html',{
        'redirectUrl':`/${req.app.locals.adminPath}/focus`,
         'message':'删除成功'
    })
})

routes.get('/edit', async (req,res)=>{
   //修改
   var result =  await FocusModel.find({ _id:req.query.id})
    //跳转 
   res.render('admin/focus/edit.html',{
        list:result[0]
   })
   
})

routes.post('/doEdit', multer().single('focus_img'),async (req,res)=>{
    try {
        // 查找需要修改的数据
        var resultList = await FocusModel.find({'_id':req.body.id})
        // 查看是否携带图片
        if (req.file) {
            // 操作图片
            var focus_img = req.file ? req.file.path.slice(7) : ''
            // 提交修改
            const update = await FocusModel.updateOne({'_id':req.body.id},Object.assign(req.body,{'focus_img':focus_img}))
            // 修改成功 保存图片
            if(update.acknowledged){
                if (resultList[0].focus_img) {
                    fs.unlink('static/'+resultList[0].focus_img,(err)=>{
                        console.log(err);
                    })
                }
               
            }

        }else{
            // 修改
            await FocusModel.updateOne({'_id':req.body.id},req.body)
        }

        res.render('admin/public/success.html',{
            'redirectUrl':`/${req.app.locals.adminPath}/focus`,
            'message':'修改成功'
        })

    } catch (error) {
        // 报错
        res.render('admin/public/error.html?id='+req.body.id,{
            'redirectUrl':`/${req.app.locals.adminPath}/focus`,
            'message':'修改数据失败'
        })

    }
})


module.exports  = routes