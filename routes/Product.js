const express = require('express')
const auth = require('../middleware/auth')
const Product = require('../models/Product') 

const router = express.Router()

router.post('/product/create', auth, async (req, res) => {
    const product = new Product({
        owner: req.user._id,
        ...req.body
    })
    try {
        await product.save()
        res.status(201).send(product)
    } catch (error) {
        res.status(501).send(error.message)
    }
})

router.get('/product/viewProduct/:id', auth, async (req, res) => {
    try {
        const product = await Product.findOne({_id: req.params.id, owner: req.user._id})
        res.status(200).send(product)
    } catch (error) {
        res.status(404).send(error.message)
    }
})

router.get('/product/viewAllProducts', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'Products',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate()
        res.status(200).send(req.user.Products)
    } catch (error) {
        res.status(404).send(error.message)
    }
})

router.patch('/product/update/:id', auth, async (req, res) => {
    const validKeys = ['name', 'price', 'cost', 'purchaseDate', 'saleDate']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update) => validKeys.includes(update))
    try {
        if(!isValid){
            throw new Error('Invalid parameters')
        }
        const product = await Product.findOne({_id:req.params.id,owner: req.user._id}) 
        updates.forEach((update) => product[update] = req.body[update])
        await product.save()
        res.status(200).send(product)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.delete('/product/delete/:id', auth, async (req, res) => {
    try {
        const product = await Product.findOne({_id:req.params.id,owner: req.user._id})
        await product.remove()
        res.status(200).send(product)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router