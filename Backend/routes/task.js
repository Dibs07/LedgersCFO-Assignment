const express = require('express')
const { createTask, getTasksByClientId,updateTask,deleteTaskbyId } = require('../controllers/task')

const taskRouter = express.Router()

taskRouter.post('/create',createTask)
taskRouter.get('/client/:client_id',getTasksByClientId)
taskRouter.put('/update/:task_id',updateTask)
taskRouter.delete('/delete/:task_id',deleteTaskbyId)

module.exports = taskRouter