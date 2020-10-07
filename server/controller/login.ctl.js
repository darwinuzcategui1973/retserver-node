const { response } = require('express');

const express = require('express');

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require("../models/usuario");

const { generarJwt } = require('../helpers/jwt');

const { googleVerify } = require('../helpers/google-verify');

// const app = express();


const login = async (req, res) => {

    let {email, password } = req.body;

    try {

        //await Usuario.findOne({ email }, (error, usuarioBD) => {
        const usuarioBD = await Usuario.findOne({ email } );
         
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                        message: "(Usuario) o contraseña incorrectos"
                    }
            });
    
        }
    
        if (!bcrypt.compareSync(password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                        message: "Usuario o (contraseña) incorrectos"
                    }
            });
    
        }

        // Generar el token  JWT
        /*
        const token = jwt.sign({
            usuario: usuarioBD
        },
        process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        */
       const token = await generarJwt(usuarioBD);
        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        })
            
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            mensaje: 'Hable con el administrador, error inesperado',
            error
        });
        
    }



};


// CONFIGURACION DE GOOGLE SERVICIO
const google = async(req, res=response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            // si no existe el usuario
            
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@usuarioDeGoogle',
                img: picture,
                google: true
            });
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar en DB
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJwt( usuario );
        
        res.json({
            ok: true,
            token,
            name, email, picture
           // menu: getMenuFrontEnd( usuario.role )
        });

    } catch (error) {
        
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',
        });
    }

}

module.exports = {
    login,
    google

}