const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

app.use(express.json())   //converts the incoming request json to object
app.use(userRouter)       //importing routers from others file
app.use(taskRouter)        

//without middleware:  new request -> run route handler
//with middleware:  new request -> do something -> run route handler

app.listen(port,() => {
    console.log('server is up and running on port '+port)
})