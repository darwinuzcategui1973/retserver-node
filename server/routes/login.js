const express = require('express');

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require("../models/usuario");

const app = express();


app.post("/login", (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (error, usuarioBD) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                error
            });

        };

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(Usuario) o contraseña incorrectos"
                }
            });

        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o (contraseña) incorrectos"
                }
            });

        }

        let token = jwt.sign({
            usuario: usuarioBD

        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        })

    });

});


// CONFIGURACION DE GOOGLE SERVICIO

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    //console.log(payload);
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}
verify().catch(console.error);
// https://developers.google.com/identity/sign-in/web/backend-auth
//  me quede en video 3 seccion 11
// 

app.post("/google", async(req, res) => {

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


});

module.exports = app;