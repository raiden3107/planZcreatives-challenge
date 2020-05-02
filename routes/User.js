const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')

router.post('/user/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token})
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.getByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token})
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.status(200).send({ user: 'User is logged out' })
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

router.post('/user/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send({ user: 'User is logged out from every device' })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/user/profile', auth, async (req, res) => {
    res.status(200).send(req.user)
})

router.patch('/user/update', auth, async (req, res) => {
    const validKeys = ['email', 'password']
    const updateKeys = Object.keys(req.body)
    const isValid = updateKeys.every((update) => validKeys.includes(update))
    if(!isValid){
        return res.status(501).send({error: 'Invalid parameters.'})
    }
    try {
        updateKeys.forEach((keys) => req.user[keys] = req.body[keys])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.delete('/user/remove', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send(req.user)
    } catch (error) {
        res.status(501).send({error: 'No such user exists.'})
    }
})

module.exports = router