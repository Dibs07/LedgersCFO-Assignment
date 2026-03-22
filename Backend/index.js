const express = require('express')
require('dotenv').config();
app = express()
const port = 3001
const connectdb = require('./config/dbConfig');
const clientrouter = require('./routes/client');
const taskRouter = require('./routes/task');
app.use(express.json())
app.use('/api/client',clientrouter)
app.use('/api/task',taskRouter)
connectdb()
app.listen(port,()=>{
    console.log(`Server running at ${port}`)
})