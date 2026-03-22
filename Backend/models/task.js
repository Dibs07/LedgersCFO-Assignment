const mongoose = require('mongoose')
const { Schema } = mongoose
const { randomUUID } = require('crypto')

const TaskSchema = new Schema(
  {
    id: {
      type: String,
      default: () => randomUUID(),
      unique: true,
    },
    client_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
        required: true,
        trim: true,
    },
    description: {  
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    due_date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['pending', 'in_progress', 'completed'],
    },
    priority: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high'],
    }
  },
  { timestamps: true }
)

const TaskModel = mongoose.model('tasks', TaskSchema)

module.exports = TaskModel