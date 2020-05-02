require('./db/mongoose')
const express = require('express')
const userRouter = require('./routes/User')
const productRouter = require('./routes/Product')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000
const publicDirectory = path.join(__dirname, './public')

app.use(express.static(publicDirectory))
app.use(express.json())
app.use(userRouter)
app.use(productRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})