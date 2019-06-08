const mongoose = require('mongoose')

const taskSchemas = mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    }
}, {
    timestamps:true
})

const Task = mongoose.model('Task', taskSchemas)

module.exports = Task


// const task = new tasks({
//     description:'house cleaning      ',
// })

// task.save().then(() => {
//     console.log(task)
// }).catch((error) => {
//     console.log(error)
// })
