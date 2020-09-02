const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const _ = require("underscore");

let app = express();

let Empresa = require('../models/empresa');

// ==================================
//  Obtener o lista los Empresas
// ==================================
app.get('/empresas', verificaToken, (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);


    Empresa.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort("nombre")
        .populate("usuarioADMINISTRADOR", "nombre email")
        .exec((error, empresas) => {
            if (error) {

                return res.status(400).json({
                    ok: false,
                    error
                });

            }


            Empresa.countDocuments({ disponible: true }, (error, conteo) => {
                res.json({
                    ok: true,
                    empresas,
                    cuantosReg: conteo



                });
            });

        })

});


// ==================================
//  Obtener un Empresa por id
// ==================================
app.get("/empresas/:id", verificaToken, (req, res) => {
    // muestra un grupo por su Id
    let id = req.params.id;
    console.log(id);

    // Empresa.findById(id);
    Empresa.findById(id)
        .populate("usuario", "nombre email")
        .exec((error, empresaBD) => {


            if (error) {

                return res.status(400).json({
                    ok: false,
                    error
                });

            };


            if (!empresaBD) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "Empresa no Encontrado!."
                    }
                });
            }

            res.json({
                ok: true,
                empresa: empresaBD
            });


        });




});

// ==================================
//  Busca Empresas
// ==================================
app.get('/empresas/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let expresionRegular = new RegExp(termino, 'i')


    Empresa.find({ nombre: expresionRegular, disponible: true })

    .exec((error, empresas) => {

        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        };


        if (!empresas) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Empresa no Encontrado!."
                }
            });
        }

        res.json({
            ok: true,
            empresa: empresas
        });


    });


});

// ==================================
//  Crear nuevos Empresas
// ==================================
app.post("/empresas", [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuarioADMINISTRADOR = req.usuario._id;


    let empresa = new Empresa({
        codigoEmpresa: body.codigoEmpresa,
        nombre: body.nombre,
        ubicacion: body.ubicacion,
        fechaCompraLicencia: body.fechaCompraLicencia,
        fechaVencimientoLicencia: body.fechaVencimientoLicencia,
        versionSistemas: body.versionSistemas,
        ultimoAcesso: body.ultimoAcesso,
        informacionEmpresa: body.informacionEmpresa,
        usuarioADMINISTRADOR
    });

    // proceder a grabar
    empresa.save((error, empresaDB) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                error
            });

        }
        if (!empresaDB) {
            return res.status(400).json({
                ok: false,
                error
            });

        }

        res.json({
            ok: true,
            empresa: empresaDB
        });

    });

});


// ==================================
//  Actulizar un Empresa
// ==================================
app.put('/empresas/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    const arreglo = ["nombre", "fechaVencimientoLicencia", " ubicacion", "usuarioADMINISTRADOR", "UltimoAcesso"];
    let body = _.pick(req.body, arreglo);


    //delete body.google

    Empresa.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, empresaDB) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                error
            });

        };

        if (!empresaDB) {
            return res.status(400).json({
                ok: false,
                error
            });

        }


        res.json({
            ok: true,
            empresa: empresaDB
        });


    });

});

// ==================================
//  Borrar un Empresa
// ==================================
app.delete('/empresas/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let cambioEstado = {
        "disponible": false
    };


    Empresa.findByIdAndUpdate(id, cambioEstado, { new: true }, (error, empresaBD) => {


        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        };

        // voy a seguir en video 15 seccion 9

        if (!empresaBD) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Empresa no Encontrado!."
                }
            });
        }

        res.json({
            ok: true,
            mensaje: "Empresa no Disponible",
            empresa: empresaBD
        });


    });
});


module.exports = app;