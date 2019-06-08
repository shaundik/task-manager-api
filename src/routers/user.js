const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancelEmail} = require('../emails/account')

const router = new express.Router()
//REST API endpoints creation
router.post('/users', async (req,res) => {     
                 
    const user = new User(req.body)        //req.body is the object form of json data sent in request

    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch (e) {
        res.status(400).send(e)
    }

})

router.post('/users/login', async (req, res) => {
    try {
        const user  = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        
        res.send({ user,token})
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

        res.send()
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
        req.user.remove() 
        sendCancelEmail(req.user.email, req.user.name)
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