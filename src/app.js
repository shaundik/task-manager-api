const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const path =  require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')

const app = express()

const publicDirPath = path.join(__dirname,'../public')
const viewsDirPath = path.join(__dirname,'../templates/views')
const partialsDirPath = path.join(__dirname,'../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsDirPath)
hbs.registerPartials(partialsDirPath)

app.use(express.static(publicDirPath))

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.json())   //converts the incoming request json to object
app.use(userRouter)       //importing routers from others file
app.use(taskRouter)        

module.exports = app