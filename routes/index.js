const express = require('express')

var routes = express.Router()

routes.get('/',(req,res)=>{
    res.send('首页123')
})


module.exports  = routes