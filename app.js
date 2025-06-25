// 引入express
const express = require('express')
// 引入ejs
const ejs = require('ejs')
// 进入body-parser ##解析请求携带的请求体
const bodyParser = require('body-parser')
// 配置session ##类似cooike 用于保存用户信息
const session = require('express-session')
// 引入基地址
const config = require('./config/config')

// 创建express服务
const app = express()
// 端口号
const port = 3000

// 文件上传中间件
const multer = require('multer')

//引入外部路由
const admin = require('./routes/admin')
const index = require('./routes/index')
const api = require('./routes/api')



// 配置ejs 修改后缀名
app.engine('html',ejs.__express)
app.set('view engine','html')

// 配置静态资源路径
app.use(express.static('static'))

//配置bodyParser
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


// 配置外部路由模块
app.use('/'+config.adminPath,admin)
app.use('/api',api)
app.use('/',index)

app.locals.adminPath = config.adminPath


app.listen(port, () => console.log(`127.0.0.1:${port}`))