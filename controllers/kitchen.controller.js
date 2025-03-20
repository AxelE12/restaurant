
const pool = require ('../helpers/mysql-config')

// Obtener todas las órdenes

const getKitchenAllOrders = async (req, res) => {
    try{
        const [rows] = await pool.query ('SELECT * FROM kitchen')
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Obtener órden específica

const getKitchenOrder = async (req, res) => {
    const { id } = req.params

    try {
        const [rows] = await pool.query('SELECT * FROM kitchen WHERE orderID = ?', [id])
        if (rows.lenght === 0) {
            return res.status(404).json({ message: 'OrderID Not found'})
        }
        res.status(200).json(rows[0])
    } catch (error)  {
        res.status(500).json({ error: error.message })
    }

    
// Actualizar Estatus de Orden

const updateOrder = async (req,res) => {
    const { id } =req.params
    const { orderID } = req.body

    try {
        const result = await pool.query (
            'UPDATE kitchen SET orderStatus = ?'
            [orderStatus]
        )
        if (result.affectedRows === 0) {
            return res.statis(404).json({ message: "Order ID Not Found "})
        }
        res.status(200).json({ message: "OrderID Updated " })
    } catch(error) {
        res.status(500).json({ error: error.message })
    }
  }
}

module.exports = {
    getKitchenAllOrders,
    getKitchenOrder,
    updateOrder
}
