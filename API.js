



const express = require('express') 
const mqtt = require('mqtt') 
const cors = require('cors')
const pool = require('./helpers/mysql-config')
require('dotenv').config() 
const port = process.env.PORT

const app = express()
 
// Pendiente.

const planttype = require('./routes/planttype') 
const user = require('./routes/user') 
const plantregister = require('./routes/plantregister') 
const sensordictionary = require('./routes/sensordictionary')
const reading = require('./routes/reading')
const watertank = require('./routes/watertank')
//const userRegister = require ('../front/assets/js/signup')

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json()) 


/*
app.use('/planttype', planttype)  
app.use('/user', user)  
app.use('/plantregister', plantregister)  
app.use('/sensordictionary', sensordictionary)  
app.use('/reading', reading)  
app.use('/watertank', watertank)
*/

app.use('/POS', POS)
app.use('kitchen', kitchen)

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`) 
}) 

// Conexión al broker MQTT
const mqttClient = mqtt.connect(`ws://${process.env.MQTTHOST}`, {
    clientId: 'mario',
    clean: true,
    reconnectPeriod: 1000
})

// Tópico y canal

/*
const topic = 'hydrosync/humidity1' 
const topic1 = 'hydrosync/humidity2'
const topic2 = 'hydrosync/humidity3'
const topic3 = 'hydrosync/pump1'
const topic4 = 'hydrosync/pump2'
const topic5 = 'hydrosync/pump3'
const topic6 = 'hydrosync/temperature'
const topic7 = 'hydrosync/distance'
const topicos = [topic, topic1, topic2, topic3, topic4, topic5, topic6, topic7]
*/

const topicPOS = 'smartKitchen/POS'
const topicKitchen = 'smartKitchen/kitchen'

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
        
        const sql = `INSERT INTO comanda(comandaTipo, status) VALUES (?,?)`;

        const params = [comandaTipo, status];

        const consulta = pool.format(sql, params);

        console.log(consulta)
        
        const [result] = await pool.query(sql, [

            data.comandaTipo,
            data.status

        ]);

        console.log('Datos insertados exitosamente:', {
            comandaTipo: data.comandaTipo,
            status: data.sta

        });
        
    } catch (error) {
        console.error('Error al insertar los datos en la base de datos:', error.message, data);
    }
});

mqttClient.on('offline', () => {
    console.warn('El cliente MQTT se encuentra offline.')
})


mqttClient.on('reconnect', () => {
    console.log('Reconectando al broker...');
})

mqttClient.on('error', (err) => {
    console.error('Error en el cliente MQTT:', err.message)
})










// npm install
// Función Callback
// Función que se ejecuta como respuesta a una petición (eventos)
/*
// Rutas
app.use(express.json()) // Middleware para que express entienda JSON
app.use('/branch', branch)
*/

// http://localhost:3000/
// Cualquier método HTTP recibe una ruta y una finción callback

app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        details: err.message 
    });
});

