const express = require('express') 
const mqtt = require('mqtt') 
const cors = require('cors')
const pool = require('./helpers/mysql-config')
require('dotenv').config()

const port = process.env.PORT || 3000
const app = express()
 
// Pendiente.

const POS = require ('./routes/POS')
const kitchen = require('./routes/kitchen')

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT','DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json()) 


app.use('/smartKitchen/POS', POS)
app.use('/smartKitchen/kitchen', kitchen)

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`) 
}) 

// Conexión al broker MQTT
const mqttClient = mqtt.connect(`ws://${process.env.MQTTHOST}`, {
    clientId: 'MQTT_Broker',
    username: process.env.MQTTUSER, // Usuario desde .env
    password: process.env.MQTTPASS,  // Contraseña desde .env
    clean: true,
    reconnectPeriod: 1000
})

// Tópico y canal

const topicPOS = 'smartKitchen/POS'
const topicKitchen = 'smartKitchen/Kitchen'
const topicos = [topicPOS, topicKitchen]

mqttClient.on('connect', () => {
    console.log(`Conectado al broker MQTT.`)
    mqttClient.subscribe(topicos, {qos: 0}, (err) => {
        if (err) {
            console.error(`Error al suscribirse al tópico: ${err.message}`)
        } else {
            console.log(`Suscrito al tópico: ${topicos}`)
        }
    })
})

// Manejo de mensajes recibidos desde MQTT

mqttClient.on('message', async (receivedTopic, message) => {

    const data = JSON.parse(message.toString())
    console.log(`Mensaje recibido en ${receivedTopic}:`, data)

    try {
        
        const sql = `INSERT INTO comandas(alimento, estado, hora) VALUES (?,?,?)`

        const params = [data.alimento, data.estado, data.hora]

        const consulta = pool.format(sql, params)

        console.log(consulta)
        
        const [result] = await pool.query(sql, params)

        console.log('Datos insertados exitosamente:', {
            alimento: data.alimento,
            status: data.estado,
            hora: data.hora
        })
        
    } catch (error) {
        console.error('Error al insertar los datos en la base de datos:', error.message, data)
    }

})

mqttClient.on('offline', () => {
    console.warn('El cliente MQTT se encuentra offline.')
})

mqttClient.on('reconnect', () => {
    console.log('Reconectando al broker...')
})

mqttClient.on('error', (err) => {
    console.error('Error en el cliente MQTT:', err.message)
})

app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        details: err.message 
    });
});
