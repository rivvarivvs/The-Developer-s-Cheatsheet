const express = require('express')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()

const item = require('./routes/api/item')

//Set up mongoose connection
const mongoDB = process.env.DB;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json())
app.use('api/item', item)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server start on port: ${port}`)
})
