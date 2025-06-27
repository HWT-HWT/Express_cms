const express = require('express')
const article = require('../../model/article')
var routers = express.Router()

routers.get('/',(req,res)=>{
    res.send('api接口v1')
})

routers.get('/article',async(req,res)=>{
    result = await article.find({})
    res.json({
        'success':true,
        'message':'登录成功',
        'result':result
    })
})


routers.delete('/doLogin',(req,res)=>{
    var body = req.body
    console.log(body);
    res.jsonp({
        'success':true,
        'message':'登录成功',
        'result':body
    })
})

module.exports = routers