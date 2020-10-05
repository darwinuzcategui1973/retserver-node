/*
    Ruta: "/api/login"
*/

const { Router } = require('express');
const { check } = require ( 'express-validator' );

const { login,google } = require('../controller/login.ctl');

const {
    verificaToken,
    verificaAdmin_Role
} = require("../middlewares/autenticacion")

const { validarCampos } = require('../middlewares/validar-campos');

const ruta = Router();

ruta.post('/',
[
  
   
    check('password',"El Password es obligatorio").not().isEmpty(),
    check('email',"Email debe ser de tipo Email").isEmail(),
    validarCampos
  

],login)

module.exports = ruta;