const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const auth = require('../middleware/auth')
const app = require('../app')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancelEmail} = require('../emails/account')

const router = new express.Router()

router.get('', (req,res) => {
    if(req.query.alert){
        res.render('form',{
            info:'your account was deleted'
        })
    }
    else{
        res.render('form')
    }
})

router.get('/login', (req,res) => {
    res.render('login')
})

router.get('/profile', (req,res) => {
    if(req.query.alert === 'updated'){
        res.render('profile',{info: 'User Data Updated Successfully'})
    }
    else if(req.query.alert === 'taskUpdated'){
        res.render('profile',{info: 'One task updated'})
    }
    else if(req.query.alert === 'taskAdded'){
        res.render('profile',{info: 'New task added'})
    }
    else if(req.query.alert==='login'){
        res.render('profile',{
            name:req.query.name
        })
    }
    else{
      res.render('profile')
    }
})

router.get('/logout', (req,res) => {
    //console.log(req.query)
    if(req.query.all){
        res.render('logout',{
            ofAll: 'From your all sessions'
        })
    }else{
        res.render('logout')
    }
})

router.get('/users/profile',(req, res) => {
    res.render('userprofile',{
        name : req.query.name,
        email: req.query.email,
        age: req.query.age
    })
})

router.get('/users/updateform', (req,res) => {
    //console.log(req.query)
    res.render('updateform',{
        name: req.query.name,
        email: req.query.email,
        age: req.query.age
    })
})

//REST API endpoints creation
router.post('/users', async (req,res) => {     

    // console.log('naman')
    // console.log(req.body)
    const user = new User(req.body)        //req.body is the object form of json data sent in request

    try{
        //console.log('shaundik')
        await user.save()
        //sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch (e) {
        //console.log('kumar')
        res.status(400).send(e)
    }

})

router.post('/users/login', async (req, res) => {
    try {
        const user  = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user,token})
        // res.render('profile',{
        //     name:user.name,
        //     email:user.email
        // })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        //console.log('naman')
        res.send('sucessfilly logged out')
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutALL', auth, async(req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req,res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async(req,res) => {
    
    const allowesUpdates = ['name','age','email','password']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => {
        return allowesUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send('Error: Invalid Updates' )
    }

    try {
        // const user  = await User.findById(req.params.id)

        // if(!user){
        //     return res.status(404).send('Error: user not found')
        // }

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async(req, res) => {

    try {
        await req.user.remove() 
        //sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)

    } catch (e) {
        res.status(500).send(e)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter (req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Please upload a image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')  //setting 'Content-Type header by default it is set to application/json
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router