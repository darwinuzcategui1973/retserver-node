// *******************************************************
// Grupo
// Ruta: 'api/grupo'
//
// **********************************************************

// importaciones
const { Router } = require("express");

const { check } = require("express-validator");

const {
  getGrupos,
  getUnGrupo,
  crearGrupo,
  saveAllGrupo,
  actualizarGrupo,
  borrarGrupo,
} = require("../controller/grupo.ctl");

const {
  verificaToken,
  verificaAdmin_Role,
  verificaEmpresa
} = require("../middlewares/autenticacion");

const { validarCampos } = require("../middlewares/validar-campos");

const ruta = Router();

//*************************************************************
// petición GET de  lista de grupos
//*************************************************************
ruta.get("/",[verificaToken,verificaEmpresa], getGrupos);

//*************************************************************
// petición GET de  Una Grupo por ID Grupo
//*************************************************************
ruta.get("/:id",
  [
    verificaToken,
    check("id", "El Grupo id debe de ser válido").isMongoId(),
    validarCampos,
  ],
  getUnGrupo
);

//*************************************************************
// petición post de  Crear grupos
//*************************************************************
ruta.post("",
  [
    verificaToken,
    verificaAdmin_Role,
    verificaEmpresa,
    check("codigoGrupoGmd", "El Codigo de Grupo es Obligatorio").notEmpty(),
    check("nombre", "El Nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearGrupo
);

//*************************************************************
// petición post de  Grabar Por una lista de grupos
//*************************************************************
ruta.post("/saveall",
  [
    verificaToken,
    verificaAdmin_Role,
    verificaEmpresa,
    ],
  saveAllGrupo
);

//*************************************************************
// petición put de  actulizar grupos
//*************************************************************
ruta.put("/:id",
  [
    verificaToken,
    verificaAdmin_Role,
    check("nombre", "El Nombre es obligatorio").not().isEmpty(),
    check("id", "El Grupo id debe de ser válido").isMongoId(),
    validarCampos,
  ],
  actualizarGrupo
);

//*************************************************************
// petición delete  marcar grupos
//*************************************************************
ruta.delete("/:id",
  [
    verificaToken,
    verificaAdmin_Role,
    check("id", "El Grupo id debe de ser válido").isMongoId(),
    validarCampos,
  ],
  borrarGrupo
);

module.exports = ruta;
