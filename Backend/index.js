const express = require('express')
const cors = require('cors');
require('dotenv').config();
app = express()
const port = 3001

const connectdb = require('./config/dbConfig');
const clientrouter = require('./routes/client');
const taskRouter = require('./routes/task');

const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));
app.use(express.json())
app.use('/api/client',clientrouter)
app.use('/api/task',taskRouter)

connectdb()
app.listen(port,()=>{
    console.log(`Server running at ${port}`)
})