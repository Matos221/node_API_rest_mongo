const express = require('express')
const router = express.Router()
const Book = require('../models/book.models')


// MIDDLEWARE, esto servira para tomar un solo libro, además de usarla en varias llamadas
const getBook = async (req, res, next) => { // Recibe una request, una response y next. Siendo next el libro siguiente
        let book;
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) { // Evaluamos que el "id" del libro exista, a traves de los caracteres usados por "Mongoose"

                return res.status(404).json({
                        message: 'El ID del libro no es valido'
                })

        }

        try {
                book = await Book.findById(id)
                if (!book) {
                        return res.status(404).json({
                                message: 'El libro no fue encontrado'
                        })
                }

        } catch (error) {
                return res.status(500).json({
                        message: error.message
                })
        }

        res.book = book;
        next()
}

// Obtener todos los libros. Pero debemos aplicar un "middleware" para comprobar que el libro esta disponible o no. [GET ALL]
router.get('/', async (req, res) => {
        try {
                const books = await Book.find()
                console.log('GET ALL', books)

                if (books.length === 0) {
                        return res.status(204).json([])
                }

                res.json(books)

        } catch (error) {

                res.status(500).json({ message: error.message })
        }
})

// Crear un nuevo libro (estamos creando un RECURSO) [POST]
router.post('/', async (req, res) => {
        const { title, author, genre, publication_date } = req?.body

        if (!title || !author || !genre || !publication_date) {
                return res.status(400).json({
                        message: 'Los campos titulo, autor, fecha y genero, son OBLIGATORIOS'
                })
        }

        const book = new Book(
                {
                        title,
                        author,
                        genre,
                        publication_date
                }
        )

        try {

                const newBook = await book.save()
                console.log(newBook)
                res.status(201).json(newBook)

        } catch (error) {
                res.status(400).json({
                        message: error.message
                })

        }

})

// A partir de aca, para toda peticion HTTP se usara el '/:id' de cada recurso/libro y la funcion/MIDDLEWARE "getBook", que retornara el libro solicitado

// Creamos el "get", individual, es decir para buscar u obtener un solo libro [GET]
router.get('/:id', getBook, async (req, res) => {
        res.json(res.book)
})


// Creamos el "put" para actualizar algun recurso "especifico" de la base de datos [PUT]
router.put('/:id', getBook, async (req, res) => {
        try {

                const book = res.book
                book.title = req.body.title || book.title;
                book.author = req.body.author || book.author;
                book.genre = req.body.genre || book.genre;
                book.publication_date = req.body.publication_date || book.publication_date;

                const updatedBook = await book.save()
                res.json(updatedBook);

        } catch (error) {
                res.status(400).json({
                        message: error.message
                })
        }
})

// Creamos el "patch" para modificar un recurso parcial de algun recurso general [PATCH]
router.patch('/:id', getBook, async (req, res) => {

        if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date){
                res.status(400).json({
                        message: 'Algunos de los campos: titulo, autor, genero y fecha de publicación, deben ser enviados'
                })
        }

        try {

                const book = res.book
                book.title = req.body.title || book.title;
                book.author = req.body.author || book.author;
                book.genre = req.body.genre || book.genre;
                book.publication_date = req.body.publication_date || book.publication_date;

                const updatedBook = await book.save()
                res.json(updatedBook);

        } catch (error) {
                res.status(400).json({
                        message: error.message
                })
        }
})

// Creamos el "delete", con el que se borrara de la base alguno de los recursos [DELETE]
router.delete('/:id', getBook, async (req, res) => {
        try {
                const book = res.book;
                await book.deleteOne({
                        _id: book._id
                })

                res.json({
                        message: `El libro ${book.title} fue eliminado correctamente`
                })

        } catch (error) {
                res.status(500).json({
                        message: error.message
                })
        }
})

module.exports = router