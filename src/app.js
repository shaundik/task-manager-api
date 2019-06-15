const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

//app.use(express.static('./public'))

app.use(express.json())   //converts the incoming request json to object
app.use(userRouter)       //importing routers from others file
app.use(taskRouter)        

module.exports = app