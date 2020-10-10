// *******************************************************
// Vendedor
// Ruta: 'api/vendedor'
//
// **********************************************************

// importaciones
const { Router } = require("express");

const { check } = require("express-validator");

const {
  getVendedors,
  getUnVendedor,
  crearVendedor,
  saveAllVendedor,
  actualizarVendedor,
  borrarVendedor,
} = require("../controller/vendedor.ctl");

const {
  verificaToken,
  verificaAdmin_Role,
  verificaEmpresa
} = require("../middlewares/autenticacion");

const { validarCampos } = require("../middlewares/validar-campos");

const ruta = Router();

//*************************************************************
// petición GET de  lista de vendedors
//*************************************************************
ruta.get("/",[verificaToken,verificaEmpresa], getVendedors);

//*************************************************************
// petición GET de  Una Vendedor por ID Vendedor
//*************************************************************
ruta.get("/:id",
  [
    verificaToken,
    check("id", "El Vendedor id debe de ser válido").isMongoId(),
    validarCampos,
  ],
  getUnVendedor
);

//*************************************************************
// petición post de  Crear vendedors
//*************************************************************
ruta.post("",
  [
    verificaToken,
    verificaAdmin_Role,
    verificaEmpresa,
    check("codigoVendedorGmd", "El Codigo de Vendedor es Obligatorio").notEmpty(),
    check("nombre", "El Nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearVendedor
);

//*************************************************************
// petición post de  Grabar Por una lista de vendedors
//*************************************************************
ruta.post("/saveall",
  [
    verificaToken,
    verificaAdmin_Role,
    verificaEmpresa,
    ],
  saveAllVendedor
);

//*************************************************************
// petición put de  actulizar vendedors
//*************************************************************
ruta.put("/:id",
  [
    verificaToken,
    verificaAdmin_Role,
    check("nombre", "El Nombre es obligatorio").not().isEmpty(),
    check("id", "El Vendedor id debe de ser válido").isMongoId(),
    validarCampos,
  ],
  actualizarVendedor
);

//*************************************************************
// petición delete  marcar vendedors
//*************************************************************
ruta.delete("/:id",
  [
    verificaToken,
    verificaAdmin_Role,
    check("id", "El Vendedor id debe de ser válido").isMongoId(),
    validarCampos,
  ],
  borrarVendedor
);

module.exports = ruta;
