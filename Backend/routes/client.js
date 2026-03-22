const express = require('express')
const { createClient,getAllClients } = require('../controllers/client')

const clientrouter = express.Router()

clientrouter.post('/create',createClient)
clientrouter.get('/all',getAllClients)

module.exports = clientrouter