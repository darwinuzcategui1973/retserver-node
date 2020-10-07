/*
    ruta: api/imagenes/

*/
const { Router } = require('express');

const { verificaToken } = require("../middlewares/autenticacion");

const { verImagen } = require('../controller/imagen.ctl')

const ruta = Router();

ruta.get('/:tipo/:img',verificaToken, verImagen );

module.exports = ruta