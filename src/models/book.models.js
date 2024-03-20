const mongoose = require('mongoose')

// Creamos el modelo de los libros con los cuales mongoose trabajara, hay que mantener el formato propio de mongoose
const bookSchema = new mongoose.Schema(
        {
                title: String,
                author: String,
                genre: String,
                publication_date: String
        }
)

module.exports = mongoose.model('Book', bookSchema)