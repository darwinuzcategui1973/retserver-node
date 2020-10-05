const { response } = require('express');

const express = require('express');

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require("../models/usuario");

const { generarJwt } = require('../helpers/jwt');

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


const google = async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token).
    catch(e => {
        return res.status(403).json({
            ok: false,
            err: e
        });
    });
    /*
    esta funcionando
    ahora mando  grabar 
        res.json({
            usuario: googleUser
        });

        */
    // busco en la base de datos para ver si existe
    Usuario.findOne({ email: googleUser.email }, (error, usuarioBD) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                error
            });

        };

        if (usuarioBD) {

            if (usuarioBD.google == false) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Debe de usar su autenticación normal!"

                    }
                });

            } else {
                let token = jwt.sign({
                    usuario: usuarioBD

                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    usuario: usuarioBD,
                    token
                })


            }


        } else {
            // si el usuario de google no existe en nueestra base datos
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ":)";

            usuario.save((error, usuarioBD) => {

                if (error) {

                    return res.status(500).json({
                        ok: false,
                        error
                    });

                };

                let token = jwt.sign({
                    usuario: usuarioBD

                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    usuario: usuarioBD,
                    token
                });



            });




        }

    });


};

module.exports = {
    login,
    google

}