const express = require('express')
const bookRouter = express.Router();
const authGet = require('../controllers/authControllers.js')

//Auth


bookRouter.get('/book', (req, res)=> {
    res.json({msg: 'Consulta book'})
})

bookRouter.post('/book', (req, res)=> {
    res.json({msg: 'Ingreso de book'})
})
bookRouter.put('/book', (req, res)=> {
    res.json({msg: 'Actualizacion de book'})
})
bookRouter.delete('/book', (req, res)=> {
    res.json({msg: 'eliminacion de book'})
})


module.exports = bookRouter;