

const pool = require('../helpers/mysql-config')

const createOrder = async (req,res) => {
    const {orderType, time, status} = req.body

    if ( !orderType || !time || !status ) {
        return res.status(400).json( {error: 'Ingresar Todos Los Datos' })
    }
    try {
        const result = await pool.query (
            'INSERT INTO kitchen (ordertype, time, status) VALUES (?,?,?)'
            [orderType, time, status]
        )
        res.status(201).json({ message: 'Order Created', id: result.insertId })
    } catch(error) {
        res.status(500).json({ error: error.message })
    }
}

