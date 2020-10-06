// importaciones
const { response } = require("express");

const bcrypt = require("bcrypt");

const Usuario = require("../models/usuario");

const { generarJwt } = require("../helpers/jwt");


// controlador de usuarios para separar la logica
// lista usuarios
const getUsuarios = async (req, res) => {

  const desde = Number(req.query.desde) || 0;
  const limit = Number(req.query.limit) || 5;

  const [usuarios, total,cuentame] = await Promise.all([
    Usuario.find({ estado: true }, "nombre email role google img")
      .sort("role")
      .skip(desde)
      .limit(limit),

    Usuario.countDocuments({ estado: true })

  ]);

  res.json({
    ok: true,
    usuarios,
    total,
  });
};

// usuario sin token
// petición GET
const getUsuariosSinToken = async (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 5;
  limite = Number(limite);

  await Usuario.find({ estado: true }, "nombre email role estado google img")
    .skip(desde)
    .limit(limite)
    .exec((error, usuarios) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error,
        });
      }
      // Usuario.count({ estado: true }, (error, conteo) => {

      Usuario.countDocuments({ estado: true }, (error, conteo) => {
        res.json({
          ok: true,
          usuarios,
          cuantosReg: conteo,
        });
      });
    });
};

// crear usuarios
// petición POST
const crearUsuario = async (req, res = response) => {
  //let body = req.body;
  const { nombre, email, password, role } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado",
      });
    }
    const usuario = new Usuario(req.body);
    // Encriptar Contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    // fin de encriptar
    // Guardar usuario
    await usuario.save();

    // Generar el TOKEN - JWT
    const token = await generarJwt(usuario);

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
      error,
    });
  }
};

//  Actulizar Usuario
//  petición POST
const actulizarUsuario = async (req, res) => {
  //:TODO: VALIDAR email validar token  si es el usuario

  const id = req.params.id;
  // const arreglo = ["nombre", "img", "role", "email", "estado"];
  //const arreglo = ["nombre", "img", "role",  "estado"];
  // let body = _.pick(req.body, arreglo);
  // console.log("id",id);
  // console.log(body);

  try {
    // buscamos id para ver si existe
    const usuarioBD = await Usuario.findById(id);

    if (!usuarioBD) {
      return res.status(404).json({
        ok: false,
        msg: "No existe Un usuario con este Id" + id,
      });
    }

    // Actulizamos los datos
    // { new: true, runValidators: true }
    //const campos = req.body;
    // delete campos.password;
    // delete campos.google;
    const { password, google, email, ...campos } = req.body;

    // console.log(usuarioBD.email+ ' OTRO '+req.body.email);

    if (usuarioBD.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "ya existe un usuario con este email",
        });
      }
    }
    campos.email = email;

    const usuarioActulizado = await Usuario.findByIdAndUpdate(id, campos, {
      new: true,
    });
    res.json({
      ok: true,
      usuario: usuarioActulizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado",
      error,
    });
  }
};

// Eliminar Usuario
// petición DELETE
const eliminarUsuario = async (req, res) => {
  let id = req.params.id;

  try {
    await Usuario.findByIdAndDelete(id, (error, usuarioBorrado) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error,
        });
      }

      if (!usuarioBorrado) {
        return res.status(400).json({
          ok: false,
          error: {
            message: "Usuario no Encontrado!.",
          },
        });
      }

      res.json({
        ok: true,
        mensaje: "Usuario Eliminado BD",
        usuario: usuarioBorrado,
      });
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error,
    });
  }
};

const marcarElimUsuario = async (req, res) => {
  let id = req.params.id;

  let cambioEstado = {
    estado: false,
  };

  await Usuario.findByIdAndUpdate(
    id,
    cambioEstado,
    { new: true },
    (error, usuarioBD) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error,
        });
      }

      // voy a seguir en video 15 seccion 9

      if (!usuarioBD) {
        return res.status(400).json({
          ok: false,
          error: {
            message: "Usuario no Encontrado!.",
          },
        });
      }

      res.json({
        ok: true,
        usuario: usuarioBD,
      });
    }
  );
};

module.exports = {
  getUsuarios,
  getUsuariosSinToken,
  crearUsuario,
  actulizarUsuario,
  eliminarUsuario,
  marcarElimUsuario,
};
