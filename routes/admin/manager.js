const express = require('express')
const MonagerModel = require('../../model/maagerModel')
const md5 = require('md5')
const {getUnix} = require('../../model/tools')

var routes = express.Router()

routes.get('/',async (req,res)=>{

    let result = await MonagerModel.find({})
    res.render('admin/manager/index.html',{
        list:result
    })
    
})

routes.get('/add', async(req,res)=>{
    res.render('admin/manager/add.html')
})


routes.post('/doAdd', async(req,res)=>{

    var username = req.body.username
    var password = req.body.password
    var rpassword =req.body.rpassword
    var email = req.body.email
    var mobile = req.body.mobile;
    var status = req.body.status;

    if (username == '') {
        res.render('admin/public/error.html',{
            'redirectUrl':'/admin/manager/add',
            'message':'用户名不能为空'
        })
        return
    }

    if (password.length < 6 ) {
        res.render('admin/public/error.html',{
            'redirectUrl':'/admin/manager/add',
            'message':'密码不能小于六位'
        })
        return
    }

    if (password != rpassword ) {
        res.render('admin/public/error.html',{
            'redirectUrl':'/admin/manager/add',
            'message':'密码与确认密码不一致'
        })
        return
    }

    let result = await MonagerModel.find({'username':username})

    if (result.length > 0) {
        res.render('admin/public/error.html',{
            'redirectUrl':'/admin/manager/add',
            'message':'当前用户已经存在了'
        })
        return
    }else{
      var addResult = new MonagerModel ({
            username,
            password:md5(password),
            email,
            mobile,
            status,
            addtime:getUnix()
        })

        await addResult.save()

        res.redirect('/admin/manager')
    }
})


routes.get('/edit', async (req,res)=>{

    var id = req.query.id

    var result = await MonagerModel.find({'_id':id}) 

    console.log(result);
    

    if (result.length > 0) {
        res.render('admin/manager/edit.html',{
            list:result[0]
        })
    }else{
        res.redirect('/admin/manager')
    }
    
})


routes.post('/doEdit', async (req,res)=>{

    var id = req.body.id
    var password = req.body.password
    var rpassword =req.body.rpassword
    var email = req.body.email
    var mobile = req.body.mobile;
    var status = req.body.status;

   if(password.length>0){
        if(password.length<6){
            res.render('admin/public/error',{
                message:'密码长度不能小于6',
                redirectUrl:'/admin/manager/edit?id='+id
            })
            return
        }

        
        if (password != rpassword ) {
            res.render('admin/public/error.html',{
                'redirectUrl':'/admin/manager/edit?id='+id,
                'message':'密码与确认密码不一致'
            })
            return
        }

        await MonagerModel.updateOne({"_id":id},{
            'email':email,
            'mobile':mobile,
            'password':md5(password),
            'status':status
        })
    
   }else{
        await MonagerModel.updateOne({"_id":id},{
            'email':email,
            'mobile':mobile,
            'status':status
        })
   }
   res.redirect('/admin/manager')
})


routes.get('/delete', async (req,res)=>{

    var id = req.query.id
    var result = await MonagerModel.deleteOne({'_id':id}) 
    console.log(result);
    
    res.render('admin/public/success.html',{
        message:'删除数据成功',
        redirectUrl:'/admin/manager'
    })
    
})

module.exports  = routes