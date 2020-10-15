const { response } = require("express");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require("../models/usuario");

const { generarJwt } = require("../helpers/jwt");

const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res) => {

  let { email, password } = req.body;

  try {

    //await Usuario.findOne({ email }, (error, usuarioBD) => {
    const usuarioBD = await Usuario.findOne({ email });

    if (!usuarioBD) {
      return res.status(400).json({
        ok: false,
       msg: "(Usuario) o contraseña incorrectos",
      });
    }

    if (!bcrypt.compareSync(password, usuarioBD.password)) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario o (contraseña) incorrectos",
       });
    }

  
    const token = await generarJwt(usuarioBD);
    res.json({
      ok: true,
      usuario: usuarioBD,
      token,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msj: "Hable con el administrador, error inesperado",
      error,
    });
  }
};

// CONFIGURACION DE GOOGLE SERVICIO
const google = async (req, res = response) => {
  const googleToken = req.body.token;

  try {
    const { name, email, picture } = await googleVerify(googleToken);

    const usuarioDB = await Usuario.findOne({ email });
    let usuario;

    if (!usuarioDB) {
      // si no existe el usuario

      usuario = new Usuario({
        nombre: name,
        email,
        password: "@@@usuarioDeGoogle",
        img: picture,
        google: true,
      });
    } else {
      // existe usuario
      usuario = usuarioDB;
      usuario.google = true;
    }

    // Guardar en DB
    await usuario.save();

    // Generar el TOKEN - JWT
    const token = await generarJwt(usuario);

    res.json({
      ok: true,
      token,
      // menu: getMenuFrontEnd( usuario.role )
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      msg: "Token no es correcto",
    });
  }
};

// RENUEVA EL TOKEN
const renewToken = async (req, res = response) => {
    
  const uid = req.usuario.usuId;
  const usuarioBD = req.usuario;

  // Generar el TOKEN - JWT
  const token = await generarJwt(usuarioBD);

  // Obtener el usuario por UID
  const usuario = await Usuario.findById(uid);

  res.json({
    ok: true,
    token,
    usuario,
    //menu: getMenuFrontEnd( usuario.role )
  });
};

module.exports = {
  login,
  google,
  renewToken,
};
