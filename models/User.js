const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Product = require('../models/Product')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Cannot contain the word password in your password.')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('Products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'owner',
})

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'planZcreatives')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.getByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user){
        throw new Error('User does not exist.')
    }
    const isValid = await bcrypt.compare(password ,user.password)
    if(!isValid){
        throw new Error('Invalid password')
    }
    return user
    
}

// userSchema.methods.toJSON = function(){
//     const user = this
//     const userObject = user.toObject()
//     delete userObject.tokens
//     return userObject
// }

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
        next()
    }
})

userSchema.pre('remove', async function(next){
    const user = this
    await Product.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User