/*
    Ruta: "/api/usuarios

*/

//importaciones

const { Router } = require('express');
const { check } = require ( 'express-validator' );

const { 
        getUsuarios,
        getUsuariosSinToken,
        crearUsuario,
        actulizarUsuario,
        eliminarUsuario,
        marcarElimUsuario
  } = require('../controller/usuario.ctl');

const {
        verificaToken,
        verificaAdmin_Role
    } = require("../middlewares/autenticacion")

const { validarCampos } = require('../middlewares/validar-campos');

const ruta = Router();


//const app = express();

//rutas
// Ruta :usuario
//*************************************************************
// petición GET de usuarios
//*************************************************************
ruta.get('/',verificaToken, getUsuarios);
ruta.get('/sintoken/', getUsuariosSinToken);
ruta.post('/',
    [
        verificaToken,
        verificaAdmin_Role,
        check('nombre',"El Nombre es Obligatorio").notEmpty(),
        check('password',"El Password es obligatorio").not().isEmpty(),
        check('email',"Email debe ser de tipo Email").isEmail(),
        validarCampos
    ]
 ,crearUsuario);

 ruta.put('/:id',
  [
    verificaToken,
    verificaAdmin_Role,
    check('nombre',"El Nombre es Obligatorio").notEmpty(),
    check('password',"El Password es obligatorio").not().isEmpty(),
    check('role',"Role es Obligatorio").not().isEmpty(),
    validarCampos
   ],
   actulizarUsuario);
   ruta.delete('/:id',
   [
     verificaToken,
     verificaAdmin_Role
   ],eliminarUsuario);

   ruta.delete('/marcar/:id',marcarElimUsuario);


module.exports = ruta;