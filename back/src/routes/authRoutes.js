const express = require('express')
const authRouter = express.Router();
const authGet = require('../controllers/authControllers.js')

//Auth


authRouter.get('/auth', (req, res)=> {
    res.json({msg: 'Consulta auth'})
})

authRouter.post('/auth', (req, res)=> {
    res.json({msg: 'Ingreso de auth'})
})
authRouter.put('/auth', (req, res)=> {
    res.json({msg: 'Actualizacion de auth'})
})
authRouter.delete('/auth', (req, res)=> {
    res.json({msg: 'eliminacion de auth'})
})


module.exports = authRouter;