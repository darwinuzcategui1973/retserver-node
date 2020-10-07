/*

    ruta: api/uploads/
*/
const { Router } = require('express');

const expressFileUpload = require('express-fileupload');



const {
    verificaToken,
    verificaAdmin_Role
} = require("../middlewares/autenticacion")

const { fileUpload } = require('../controller/uploads.ctl');

const ruta = Router();

ruta.use( expressFileUpload() );

ruta.put('/:tipo/:id', verificaToken , fileUpload );

module.exports = ruta;