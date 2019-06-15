const app = require('./app')
const port = process.env.PORT

//without middleware:  new request -> run route handler
//with middleware:  new request -> do something -> run route handler

app.listen(port,() => {
    console.log('server is up and running on port '+port)
})