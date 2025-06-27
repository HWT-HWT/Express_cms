const express = require('express')
const v1 = require('./api/v1')
const v2 = require('./api/v2')
var routes = express.Router()

routes.use('/v1',v1)
routes.use('/v2',v2)


module.exports  = routes