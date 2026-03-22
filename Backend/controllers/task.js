const ClientModel = require("../models/client")
const TaskModel = require("../models/task")

const createTask = async(req, res) => {
    try{
        const task = req.body
        if(!task.client_id || !task.title || !task.description || !task.category || !task.due_date || !task.status || !task.priority){
            return res.status(400).json({message: "All fields are required"})
        }
        if(!['pending', 'in_progress', 'completed'].includes(task.status)){
            return res.status(400).json({message: "Invalid status"})
        }
        if(!['low', 'medium', 'high'].includes(task.priority)){
            return res.status(400).json({message: "Invalid priority"})
        }
        if(ClientModel.findOne({id: task.client_id}) == null){
            return res.status(400).json({message: "Client not found"})
        }
        const newTask = await TaskModel.create(task)
        res.status(201).json({message: "Task created successfully", task: newTask})
    }catch(err){
        return res.status(500).json({message: "Internal server error", error: err.message})
    }
}

const getTasksByClientId = async(req, res) => {
    try{
        const client_id = req.params.client_id
        if(ClientModel.findOne({id: client_id}) == null){
            return res.status(400).json({message: "Client not found"})
        }
        const tasks = await TaskModel.find({client_id})
        res.status(200).json({tasks})
    }catch(err){
        return res.status(500).json({message: "Internal server error", error: err.message})
    }
}

const updateTask = async(req, res) => {
    try{
        const task_id = req.params.task_id
        const task = await TaskModel.findOne({id: task_id})
        if(task == null){
            return res.status(400).json({message: "Task not found"})
        }
        const updatedTask = req.body
        if(updatedTask.status && !['pending', 'in_progress', 'completed'].includes(updatedTask.status)){
            return res.status(400).json({message: "Invalid status"})
        }
        if(updatedTask.priority && !['low', 'medium', 'high'].includes(updatedTask.priority)){
            return res.status(400).json({message: "Invalid priority"})
        }
        await TaskModel.updateOne({id: task_id}, updatedTask)
        res.status(200).json({message: "Task updated successfully"})
    }catch(err){
        return res.status(500).json({message: "Internal server error", error: err.message})
    }
}

const deleteTaskbyId = async(req, res) => {
    try{
        const task_id = req.params.task_id
        const task = await TaskModel.findOne({id: task_id})
        if(task == null){
            return res.status(400).json({message: "Task not found"})
        }
        await TaskModel.deleteOne({id: task_id})
        res.status(200).json({message: "Task deleted successfully"})
    }catch(err){
        return res.status(500).json({message: "Internal server error", error: err.message})
    }
}

module.exports = { createTask, getTasksByClientId, updateTask, deleteTaskbyId }