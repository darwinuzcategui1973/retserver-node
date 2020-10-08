/*
    Ruta: "/api/login"
*/

const { Router } = require('express');
const { check } = require ( 'express-validator' );

const { login, google, renewToken } = require('../controller/login.ctl');

const { verificaToken } = require("../middlewares/autenticacion")

const { validarCampos } = require('../middlewares/validar-campos');

const ruta = Router();

ruta.post('/',
[
    check('password',"El Password es obligatorio").not().isEmpty(),
    check('email',"Email debe ser de tipo Email").isEmail(),
    validarCampos
],login)

ruta.post('/google',
[
    check('token',"El token es obligatorio").not().isEmpty(),
    validarCampos
],google)

ruta.get( '/renew',
verificaToken,
renewToken
)

module.exports = ruta;