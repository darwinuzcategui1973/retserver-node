// *******************************************************
// Marca
// Ruta: 'api/marca'
//
// **********************************************************

// importaciones
const { Router } = require("express");

const { check } = require("express-validator");

const {
  getMarcas,
  getUnMarca,
  crearMarca,
  saveAllMarca,
  actualizarMarca,
  borrarMarca,
} = require("../controller/marca.ctl");

const {
  verificaToken,
  verificaAdmin_Role,
} = require("../middlewares/autenticacion");

const { validarCampos } = require("../middlewares/validar-campos");

const ruta = Router();

//*************************************************************
// petición GET de  lista de grupos
//*************************************************************
ruta.get("/", verificaToken, getMarcas);

//*************************************************************
// petición GET de  Una Marca por ID Marca
//*************************************************************
ruta.get("/:id",
  [
    verificaToken,
    check("id", "El Marca id debe de ser válido").isMongoId(),
    validarCampos,
  ],
  getUnMarca
);

//*************************************************************
// petición post de  Crear grupos
//*************************************************************
ruta.post("",
  [
    verificaToken,
    verificaAdmin_Role,
    check("codigoMarcaGmd", "El Codigo de Marca es Obligatorio").notEmpty(),
    check("nombre", "El Nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearMarca
);

//*************************************************************
// petición post de  Grabar Por una lista de grupos
//*************************************************************
ruta.post("/saveall",
  [
    verificaToken,
    verificaAdmin_Role,
    ],
  saveAllMarca
);

//*************************************************************
// petición put de  actulizar grupos
//*************************************************************
ruta.put("/:id",
  [
    verificaToken,
    verificaAdmin_Role,
    check("nombre", "El Nombre es obligatorio").not().isEmpty(),
    check("id", "El Marca id debe de ser válido").isMongoId(),
    validarCampos,
  ],
  actualizarMarca
);

//*************************************************************
// petición delete  marcar grupos
//*************************************************************
ruta.delete("/:id",
  [
    verificaToken,
    verificaAdmin_Role,
    check("id", "El Marca id debe de ser válido").isMongoId(),
    validarCampos,
  ],
  borrarMarca
);

module.exports = ruta;
