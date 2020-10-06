/*

    ruta: api/uploads/
*/
const { Router } = require('express');

const expressFileUpload = require('express-fileupload');



const {
    verificaToken,
    verificaAdmin_Role
} = require("../middlewares/autenticacion")

const { fileUpload, retornaImagen } = require('../controller/uploads.ctl');

const ruta = Router();

ruta.use( expressFileUpload() );

ruta.put('/:tipo/:id', verificaToken , fileUpload );

/*
ruta.get('/:tipo/:foto', retornaImagen );
*/


module.exports = ruta;