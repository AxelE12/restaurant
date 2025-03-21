
const pool = require ('../helpers/mysql-config')

// Obtener todas las órdenes

const getAllKitchenOrders = async (req, res) => {
    try{
        const [rows] = await pool.query ('SELECT * FROM comandas')
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Obtener órden específica

const getKitchenOrder = async (req, res) => {
    const { id } = req.params

    try {
        const [rows] = await pool.query('SELECT * FROM comandas WHERE idComanda = ?', [id])
        if (rows.lenght === 0) {
            return res.status(404).json({ message: 'ID Not found'})
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
            'UPDATE comandas SET estado = ?'
            [orderStatus]
        )
        if (result.affectedRows === 0) {
            return res.statis(404).json({ message: "OrderID Not Found "})
        }
        res.status(200).json({ message: "OrderID Updated " })
    } catch(error) {
        res.status(500).json({ error: error.message })
    }
  }
}

module.exports = {
    getAllKitchenOrders,
    getKitchenOrder
    //updateOrder
}
