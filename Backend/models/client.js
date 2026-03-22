const mongoose = require('mongoose')
const { Schema } = mongoose
const { randomUUID } = require('crypto')

const ClientSchema = new Schema(
  {
    id: {
      type: String,
      default: () => randomUUID(),
      unique: true,
    },
    company_name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    entity_type: {
      type: String,
      required: true,
      enum: ['individual', 'company', 'organization'],
    },
  },
  { timestamps: true }
)

const ClientModel = mongoose.model('clients', ClientSchema)

module.exports = ClientModel