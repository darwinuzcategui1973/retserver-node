//importaciones
const express = require('express');

const bcrypt = require("bcrypt");

const _ = require("underscore");


const Usuario = require("../models/usuario");



const app = express();

//rutas

// petición GET
app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);


    Usuario.find({ estado: true }, "nombre email role estado google img")
        .skip(desde)
        .limit(limite)
        .exec((error, usuarios) => {
            if (error) {

                return res.status(400).json({
                    ok: false,
                    error
                });

            }
            // Usuario.count({ estado: true }, (error, conteo) => {

            Usuario.countDocuments({ estado: true }, (error, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantosReg: conteo



                });
            });

        })

});
// petición POST
app.post('/usuario', (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((error, usuarioDB) => {

        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        }
        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

    /*
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "El nombre es Necesario"
        });

    } else {

        res.json({
            persona: body
        });

    }
    */
});

// petición PUT
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    const arreglo = ["nombre", "img", "role", "email", "estado"];
    let body = _.pick(req.body, arreglo);


    //delete body.google

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, usuarioBD) => {

        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        };


        res.json({
            ok: true,
            usuario: usuarioBD
        });


    });

});
// petición delete
app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {

        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        };

        // voy a seguir en video 15 seccion 9

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Usuario no Encontrado!."
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });


    });
});

// petición delete solo marcar el estado
app.delete('/usuario/marcar/:id', (req, res) => {
    let id = req.params.id;
    const arreglo = ["estado"];
    let body = _.pick(req.body, arreglo);

    body.estado = false;

    Usuario.findByIdAndUpdate(id, body, { new: true }, (error, usuarioBD) => {

        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        };

        // voy a seguir en video 15 seccion 9

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Usuario no Encontrado!."
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });


    });
});

// petición delete solo marcar como el curso
app.delete('/usuario/marcar1/:id', (req, res) => {
    let id = req.params.id;
    let cambioEstado = {
        "estado": false
    };


    Usuario.findByIdAndUpdate(id, cambioEstado, { new: true }, (error, usuarioBD) => {


        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        };

        // voy a seguir en video 15 seccion 9

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Usuario no Encontrado!."
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });


    });
});

module.exports = app;