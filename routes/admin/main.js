const express = require('express')
const FocusModel = require('../../model/focusModel')
const ManagerModel = require('../../model/maagerModel')
const NavModel = require('../../model/NavModel')


const appModel = {
    FocusModel,
    ManagerModel,
    NavModel
}

var routes = express.Router()

// 后台管理页面
routes.get('/',(req,res)=>{
    res.render('admin/main/index.html')

})


routes.get('/welcome',(req,res)=>{
    res.send('欢迎来到后台管理中心')
})

routes.get('/changeStatus', async (req,res)=>{
        // 获取传参
        var id = req.query.id //数据库中_id参数
        var model = req.query.model + 'Model' //拼接字符串
        
        var field = req.query.field // 数据库中的键名
        var json; //储存 数据库中需要修改的键名跟键值
        // 查找数据库中是否有对应的参数
        var result = await appModel[model].find({"_id":id})
        // 查找成功的操作
        if (result.length > 0) {
            // 找到对应的参数
            var tempField = result[0][field]
            // 保存需要修改的操作
            tempField == 1 ? json={[field]:0} : json={[field]:1}
            // 将保存好的参数修改到服务器
            await appModel[model].updateOne({'_id':id},json);
            // 提示
            res.send({
                success:true,
                message:'修改成功'
            })
            
        }else{
            res.send({
                success:false,
                message:'修改状态失败'
            })
        }
})

routes.get('/changeNum', async (req,res)=>{
    try {

        var id = req.query.id
        var model = req.query.model+'Model'
        var field = req.query.field
        var inputNum = req.query.inputNum

        var result = await appModel[model].find({"_id":id})

        if (result.length > 0) {

            await appModel[model].updateOne({'_id':id},{[field]:inputNum});
            
            res.send({
                success:true,
                message:'修改成功'
            })
        }
    } catch (error) {
        res.send({
            success:false,
            message:'修改失败'
        })
    }
})


module.exports  = routes