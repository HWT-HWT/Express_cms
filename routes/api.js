const express = require('express')
var routes = express.Router()

const user = require('./admin/user')
const login = require('./admin/login')
const nav = require('./admin/nav')

routes.get('/',(req,res)=>{
    res.send('api')
})

routes.use('/user',user)

routes.use('/login',login)

routes.use('/nav',nav)

module.exports  = routes