/*
Empresas
Ruta: 'api/todas'

*/

// importaciones
const { Router } = require('express');

const { check } = require ( 'express-validator' );


const { 
        getTodos,
        getBuscarDocumentosColeccion
       
  } = require('../controller/busqueda.ctl');

const {
        verificaToken,
        verificaAdmin_Role
    } = require("../middlewares/autenticacion")

const { validarCampos } = require('../middlewares/validar-campos');

const ruta = Router();

//*************************************************************
// petición GET de  Buscar Empresas por un termino
//*************************************************************
ruta.get('/:termino',verificaToken, getTodos);

//***************************************************************
// petición GET de  Buscar de una coleccion especifica un termino
//***************************************************************
ruta.get('/coleccion/:tabla/:termino',verificaToken, getBuscarDocumentosColeccion);
       //'/coleccion/:tabla/:busqueda',



// ** exportacion del modulo
module.exports = ruta;
