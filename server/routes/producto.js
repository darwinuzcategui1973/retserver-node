// *******************************************************
// Producto
// Ruta: 'api/producto'
//
// **********************************************************

// importaciones
const { Router } = require("express");

const { check } = require("express-validator");

const {
  getProductos,
  getUnProducto,
  crearProducto,
  saveAllProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controller/producto.ctl");

const {
  verificaToken,
  verificaAdmin_Role,
  verificaEmpresa
} = require("../middlewares/autenticacion");

const { validarCampos } = require("../middlewares/validar-campos");

const ruta = Router();

//*************************************************************
// petición GET de  lista de productos
//*************************************************************
ruta.get("/",[verificaToken,verificaEmpresa], getProductos);

//*************************************************************
// petición GET de  Una Producto por ID Producto
//*************************************************************
ruta.get("/:id",
  [
    verificaToken,
    check("id", "El Producto id debe de ser válido").isMongoId(),
    validarCampos,
  ],
  getUnProducto
);

//*************************************************************
// petición post de  Crear productos
//*************************************************************
ruta.post("",
  [
    verificaToken,
    verificaAdmin_Role,
    verificaEmpresa,
    check("codigoProductoGmd", "El Codigo de Producto es Obligatorio").notEmpty(),
    check("nombre", "El Nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearProducto
);

//*************************************************************
// petición post de  Grabar Por una lista de productos
//*************************************************************
ruta.post("/saveall",
  [
    verificaToken,
    verificaAdmin_Role,
    verificaEmpresa,
    ],
  saveAllProducto
);

//*************************************************************
// petición put de  actulizar productos
//*************************************************************
ruta.put("/:id",
  [
    verificaToken,
    verificaAdmin_Role,
    check("nombre", "El Nombre es obligatorio").not().isEmpty(),
    check("id", "El Producto id debe de ser válido").isMongoId(),
    validarCampos,
  ],
  actualizarProducto
);

//*************************************************************
// petición delete  marcar productos
//*************************************************************
ruta.delete("/:id",
  [
    verificaToken,
    verificaAdmin_Role,
    check("id", "El Producto id debe de ser válido").isMongoId(),
    validarCampos,
  ],
  borrarProducto
);

module.exports = ruta;
