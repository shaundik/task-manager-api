const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const path = require('path')
const app = require('../app')

const router = new express.Router()
//REST API endpoint creation
router.get('/createtaskform',(req, res) => {
    //console.log(req.query)
    if(req.query.update){
        res.render('createtaskform', {
            val:req.query.update,
            buttonName:'Update Task',
            buttonVal: req.query.id
        })
    }else{
        res.render('createtaskform',{
            buttonName:'Add New Task',
            buttonVal:'add'
        })
    }
    
})
router.get('/createtask',auth, async(req,res) => {
    res.send()
})

router.get('/taskDetails', (req,res) => {
    //console.log(req.query)
    res.render('taskdetail',{
        task:req.query.task,
        status:req.query.status,
        createdAt:req.query.createdAt,
        updatedAt:req.query.updatedAt
    })
})


router.post('/tasks', auth, async(req,res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    //console.log(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
 
})
//GET /tasks?completed=true/false
//GET /tasks?limit=10&skip=20
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async(req,res) => {
    const match = {}
    const sort = {}
    
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1]==='desc'?-1:1
    }

    try {
        //const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options: {
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }

})

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id

    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }

})

router.patch('/tasks/:id', auth, async(req,res) => {

    const updates = Object.keys(req.body)
    const allowesUpdates = ['description','completed']
    const isValidOperation = updates.every((update) => {
        return allowesUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send('Error: Invalid Updates')
    }

    try {
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true})
        const task = await Task.findOne({_id:req.params.id, owner: req.user._id})

        if(!task){
            return res.status(404).send('Error: task not found!')
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', auth, async(req, res) => {
    //console.log('naman')
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id})

        if(!task){
            return res.status(404).send('Error: task not found')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router