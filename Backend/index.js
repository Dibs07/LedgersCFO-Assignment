const express = require('express')
require('dotenv').config();
app = express()
const port = 3001
const connectdb = require('./config/dbConfig')
app.use(express.json())

connectdb()
app.listen(port,()=>{
    console.log(`Server running at ${port}`)
})