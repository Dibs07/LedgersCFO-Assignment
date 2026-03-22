const ClientModel = require("../models/client")

const createClient = async(req, res) => {
    try {
        const { country, company_name, entity_type } = req.body
        if (!country || !company_name || !entity_type) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!['individual', 'company', 'organization'].includes(entity_type)) {
            return res.status(400).json({ message: "Invalid entity type" })
        }

        const newClient = await ClientModel.create({
            country,
            company_name,
            entity_type
        })
        res.status(201).json({ message: "Client created successfully", client: newClient })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

const getAllClients = async(req, res) => {
    try {
        const clients = await ClientModel.find()
        res.status(200).json({ clients })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

module.exports = { createClient, getAllClients }