// importaciones
const { response } = require('express');
const fs = require("fs"); // file system
const path = require("path"); // path



// importaciones de los modelos
const Usuario = require("../models/usuario");
const Empresa = require("../models/empresa");
const Grupo = require("../models/grupo");
const Marca = require("../models/marca");
const Producto = require("../models/productoGMD");
const Vendedor = require("../models/vendedor");


const imagenUsuario = async (id, res, nombreArchivo) => {

  await Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, "usuarios");

      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB) {
      borrarArchivo(nombreArchivo, "usuarios");

      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no Existe!",
        },
      });
    }

    borrarArchivo(usuarioDB.img, "usuarios");
    usuarioDB.img = nombreArchivo;

    usuarioDB.save((error, usuarioGuardado) => {
      res.json({
        ok: true,
        msg: "Archivo subido",
        nombreArchivo,
      });
    });
  });
};

const imagenEmpresa = async (id, res, nombreArchivo) => {

    await Empresa.findById(id, (err, empresaDB) => {
      if (err) {
        borrarArchivo(nombreArchivo, "empresas");
  
        return res.status(500).json({
          ok: false,
          err,
        });
      }
  
      if (!empresaDB) {
        borrarArchivo(nombreArchivo, "empresas");
  
        return res.status(400).json({
          ok: false,
          err: {
            message: "Empresa no Existe!",
          },
        });
      }
  
      borrarArchivo(empresaDB.img, "empresas");
      empresaDB.img = nombreArchivo;
  
      empresaDB.save((error, EmpresaGuardado) => {
        res.json({
          ok: true,
          msg: "Archivo subido",
          nombreArchivo,
        });
      });
    });
 };

const imagenProducto = async (id, res, nombreArchivo) => {

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, "productos");

      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      borrarArchivo(nombreArchivo, "productos");

      return res.status(400).json({
        ok: false,
        err: {
          message: "Productos no Existe!",
        },
      });
    }

    borrarArchivo(productoDB.img, "productos");
    productoDB.img = nombreArchivo;

    productoDB.save((error, productoGuardado) => {
      res.json({
        ok: true,
        msg: "Archivo subido",
        nombreArchivo,
      });
    });
  });
};

const imagenGrupo = async (id, res, nombreArchivo) => {

  Grupo.findById(id, (err, grupoDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, "grupos");

      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!grupoDB) {
      borrarArchivo(nombreArchivo, "grupos");

      return res.status(400).json({
        ok: false,
        err: {
          message: "Grupos no Existe!",
        },
      });
    }

    borrarArchivo(grupoDB.fotourl, "grupos");
    grupoDB.fotourl = nombreArchivo;

    grupoDB.save((error, grupoGuardado) => {
      res.json({
        ok: true,
        msg: "Archivo subido",
        nombreArchivo,
      });
    });
  });
};

const imagenMarca = async (id, res, nombreArchivo) => {

  Marca.findById(id, (err, marcaDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, "marcas");

      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!marcaDB) {
      borrarArchivo(nombreArchivo, "marcas");

      return res.status(400).json({
        ok: false,
        err: {
          message: "Marcas no Existe!",
        },
      });
    }

    borrarArchivo(marcaDB.fotourl, "marcas");
    marcaDB.fotourl = nombreArchivo;

    marcaDB.save((error, marcaGuardado) => {
      res.json({
        ok: true,
        msg: "Archivo subido",
        nombreArchivo,
      });
    });
  });
};
const imagenVendedor = async (id, res, nombreArchivo) => {

  Vendedor.findById(id, (err, vendedorDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, "vendedores");

      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!vendedorDB) {
      borrarArchivo(nombreArchivo, "vendedores");

      return res.status(400).json({
        ok: false,
        err: {
          message: "Vendedor no Existe!",
        },
      });
    }

    borrarArchivo(vendedorDB.fotourl, "vendedores");
    vendedorDB.fotourl = nombreArchivo;

    vendedorDB.save((error, vendedorGuardado) => {
      res.json({
        ok: true,
        msg: "Archivo subido",
        nombreArchivo,
      });
    });
  });
};




// funcion privada 
function borrarArchivo(nombreImagen, tipo) {
  // eliminamos del  imagen
  let pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreImagen}`
  );

  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen); // borrar el archivo
  }
}

module.exports = {
  imagenProducto,
  imagenUsuario,
  imagenEmpresa,
  imagenGrupo,
  imagenMarca,
  imagenVendedor
};
