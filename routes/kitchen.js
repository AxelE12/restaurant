
const express = require('express')
const router = express.Router()
const controller = require ('../controllers/kitchen.controller.js')

//Ruta para obtener todas las comandas
router.get('/orders', controller.getAllKitchenOrders)

//Ruta para obtener una comanda por ID
router.get('/order/:id', controller.getKitchenOrder)

module.exports = router

