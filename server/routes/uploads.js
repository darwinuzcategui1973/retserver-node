/*

    ruta: api/uploads/
*/
const { Router } = require('express');

const { check } = require ( 'express-validator' );
const { validarCampos } = require('../middlewares/validar-campos');


const expressFileUpload = require('express-fileupload');



const {
    verificaToken,
    verificaAdmin_Role
} = require("../middlewares/autenticacion")

const { fileUpload } = require('../controller/uploads.ctl');

const ruta = Router();

ruta.use( expressFileUpload() );

ruta.put('/:tipo/:id',
[
    verificaToken,
    check('id','El usuario id debe de ser válido').isMongoId(),
    validarCampos

]  , fileUpload );

module.exports = ruta;