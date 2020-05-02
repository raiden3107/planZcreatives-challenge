const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://planZcreatives:nod32antivirus@cluster0-kcgsk.mongodb.net/test', {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true
})