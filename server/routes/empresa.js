/*
Empresas
Ruta: 'api/empresa'

*/

const { Router } = require('express');

const { check } = require ( 'express-validator' );

const { 
        getEmpresas,
        getUnaEmpresa,
        getBuscarEmpresa,
        crearEmpresa,
        actualizarEmpresa,
        borrarEmpresa
  } = require('../controller/empresa.ctl');

const {
        verificaToken,
        verificaAdmin_Role
    } = require("../middlewares/autenticacion")

const { validarCampos } = require('../middlewares/validar-campos');

const ruta = Router();


//*************************************************************
// petición GET de  lista de empresas
//*************************************************************
ruta.get('/',verificaToken, getEmpresas);

//*************************************************************
// petición GET de  Una Empresa por ID Empresas
//*************************************************************
ruta.get('/:id',verificaToken, getUnaEmpresa);

//*************************************************************
// petición GET de  Buscar Empresas por un termino
//*************************************************************
ruta.get('/buscar/:termino',verificaToken, getBuscarEmpresa);

//*************************************************************
// petición post de  Crear empresas
//*************************************************************
ruta.post('/',
    [
        verificaToken,
        verificaAdmin_Role,
        check('codigoEmpresa',"El Codigo de Empresa es Obligatorio").notEmpty(),
        check('nombre',"El Nombre es obligatorio").not().isEmpty(),
       // check('usuarioADMINISTRADOR','El usuario id debe de ser válido').isMongoId(),
        validarCampos
    ]
 ,crearEmpresa);
 

//*************************************************************
// petición put de  actulizar empresas
//*************************************************************
 ruta.put('/:id',
  [
    verificaToken,
    verificaAdmin_Role,
    // check('nombre',"El Nombre es obligatorio").not().isEmpty(),
    // validarCampos
  ],
  actualizarEmpresa);
 
 //*************************************************************
// petición delete  marcar empresas
//*************************************************************
   ruta.delete('/:id',
   [
     verificaToken,
     verificaAdmin_Role
   ],borrarEmpresa);

// ** exportacion del modulo
module.exports = ruta;