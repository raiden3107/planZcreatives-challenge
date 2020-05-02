const User = require('../models/User')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'planZcreatives')
        const user = await User.findOne({_id: decode._id, 'tokens.token': token})
        if(!user){
            throw new Error('Invalid user')
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(404).send({error: error.message})
    }
}

module.exports = auth