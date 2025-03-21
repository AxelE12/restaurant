

const pool = require('../helpers/mysql-config')

const createOrder = async (req,res) => {
    const {alimento, estado, hora} = req.body

    if ( !alimento || !estado || !hora) {
        return res.status(400).json( {error: 'Ingresar Todos Los Datos' })
    }
    try {
        const result = await pool.query (
            'INSERT INTO comandas (alimento, estado, hora) VALUES (?,?,?)',
            [alimento, estado, hora]
        )
        res.status(201).json({ message: 'Order Created', id: result.insertId })
    } catch(error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { 
    createOrder 
}