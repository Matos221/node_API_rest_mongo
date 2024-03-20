const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { config } = require('dotenv')
config()

const bookRoutes = require('./routes/book.route')

// Usamos "express" para los "MIDDLEWARE"
const app = express();

// Utilizamos el body-parser, para trabajar todos los datos o mensajes en formato POST.
app.use(bodyParser.json()) // --> Esto "parseara" el body recibido

// Conectaremos la base de datos: 
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
const db = mongoose.connection;

// Buscara solo la route de "Books"
app.use('/books', bookRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
        console.log(`Servidor iniciado en el puerto ${port}`)
})