const express = require('express')

var routers = express.Router()

routers.get('/',(req,res)=>{
    res.send('api接口v2')
})

module.exports = routers