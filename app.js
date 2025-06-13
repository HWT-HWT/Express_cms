const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const session = require('express-session')
const config = require('./config/config')

const app = express()
const port = 3000

// 文件上传中间件
const multer = require('multer')

//路由管理
const admin = require('./routes/admin')
const index = require('./routes/index')
const api = require('./routes/api')



// 配置ejs 修改后缀名
app.engine('html',ejs.__express)
app.set('view engine','html')

// 配置静态资源路径
app.use(express.static('static'))

//配置bodyParser 用于解析session
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())


//配置session
app.use(session({
    secret:'this is session',
    name:'itying',
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*30,
        secure:false
    },
    rolling:true
})) 


// 配置外部模块
app.use('/'+config.adminPath,admin)
app.use('/api',api)
app.use('/',index)

app.locals.adminPath = config.adminPath


app.listen(port, () => console.log(`127.0.0.1:${port}`))