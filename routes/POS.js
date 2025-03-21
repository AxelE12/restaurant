
const express = require('express')
const router = express.Router()
const controller = require('../controllers/pos.controller.js')

//Ruta para crear una comanda
router.post('/order', controller.createOrder)

module.exports = router
