// importaciones
const { response } = require("express");


// const { generarJwt } = require("../helpers/jwt");


// controlador de usuarios para separar la logica
// lista usuarios
const getTodos = async (req, res = response) => {

    const busqueda  = req.params.termino;

  res.json({
    ok: true,
    busqueda,
  });
};

module.exports = {
   
    getTodos,
   
  };

