const express = require('express')
// 生成验证码
const svgCaptcha = require('svg-captcha');
const ManagerModel = require('../../model/maagerModel')

const md5 = require('md5')

var routes = express.Router()

routes.get('/', async(req,res)=>{
    res.render('admin/login/login.html')
})

routes.post('/dologin',async(req,res)=>{
    // 获取用户输入的用户名
    let username = req.body.username
    // 获取用户输入的密码
    let password = req.body.password
    // 获取用户输入的验证码
    let verify = req.body.verify

    //用户输入验证码与session保存的验证码不一致的操作
    if (verify?.toLocaleLowerCase() != req.session.captcha?.toLocaleLowerCase()) {
        res.render('admin/public/error.html',{
            'redirectUrl':'/admin/login',
            'message':'图像验证码输入错误'
        })
        return
    }
    
    //查找用户的数据
    let result = await ManagerModel.find({'username':username,'password':md5(password)})

    //数据库中存在账户密码操作
    if (result.length > 0) {
        //保存用户信息到session
        req.session.userinfo = result[0]
        //提示成功
        res.render('admin/public/success.html',{
            'redirectUrl':'/admin',
            'message':'登录成功'
        })
        
    }else{
        //提示账户密码错误
        res.render('admin/public/error.html',{
            'redirectUrl':'/admin/login',
            'message':'账户密码输入错误'
        })
    }
        
    
})


routes.get('/verify', function (req, res) {
    // 生成随机验证码
    var captcha = svgCaptcha.create();
    // 打印生成的随机验证码
    console.log(captcha.text);
    // 保存验证码
    req.session.captcha = captcha.text;
    // 设置响应类型为 SVG
    res.type('svg');
    // 返回验证码图片
    res.status(200).send(captcha.data);
});

module.exports  = routes