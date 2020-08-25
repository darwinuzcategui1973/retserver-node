const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const _ = require("underscore");

let app = express();

let Producto = require('../models/productoGMD');

// ==================================
//  Obtener o lista los Productos
// ==================================
app.get('/productos', verificaToken, (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort("nombre")
        .populate("usuario", "nombre email")
        .populate("grupo", "nombre")
        .populate("marca", "nombre")
        .exec((error, productos) => {
            if (error) {

                return res.status(400).json({
                    ok: false,
                    error
                });

            }


            Producto.countDocuments({ disponible: true }, (error, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantosReg: conteo



                });
            });

        })

});


// ==================================
//  Obtener un Producto por id
// ==================================
app.get("/productos/:id", verificaToken, (req, res) => {
    // muestra un grupo por su Id
    let id = req.params.id;
    console.log(id);

    // Producto.findById(id);
    Producto.findById(id)
        .populate("usuario", "nombre email")
        .populate("grupo", "nombre")
        .populate("marca", "nombre")
        .exec((error, productoBD) => {


            if (error) {

                return res.status(400).json({
                    ok: false,
                    error
                });

            };


            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "Producto no Encontrado!."
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoBD
            });


        });




});

// ==================================
//  Busca Productos
// ==================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let expresionRegular = new RegExp(termino, 'i')


    Producto.find({ nombre: expresionRegular, disponible: true })
        .populate('grupo', 'nombre')
        .exec((error, productos) => {

            if (error) {

                return res.status(400).json({
                    ok: false,
                    error
                });

            };


            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "Producto no Encontrado!."
                    }
                });
            }

            res.json({
                ok: true,
                producto: productos
            });


        });


});

// ==================================
//  Crear nuevos Productos
// ==================================
app.post("/productos", [verificaToken, verificaAdmin_Role], (req, res) => {
    // grupo 
    // marca
    // usuario

    let body = req.body;
    // let grupo = req.grupo._id;
    // let marca = req.marca._id;
    let usuario = req.usuario._id;


    let producto = new Producto({
        codGMD: body.codGMD,
        nombre: body.nombre,
        unidadm: body.unidadm,
        precioUni: body.precioUni,
        precioUniDolar: body.precioUniDolar,
        descripcion: body.descripcion,
        grupo: body.grupo,
        marca: body.marca,
        usuario
    });

    // proceder a grabar
    producto.save((error, productoDB) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                error
            });

        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error
            });

        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});


// ==================================
//  Actulizar un Producto
// ==================================
app.put('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    const arreglo = ["nombre", "precioUniDolar", "precioUni", "descripcion", "img"];
    let body = _.pick(req.body, arreglo);


    //delete body.google

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, productoDB) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                error
            });

        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error
            });

        }


        res.json({
            ok: true,
            producto: productoDB
        });


    });

});

// ==================================
//  Borrar un Producto
// ==================================
app.delete('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let cambioEstado = {
        "disponible": false
    };


    Producto.findByIdAndUpdate(id, cambioEstado, { new: true }, (error, productoBD) => {


        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        };

        // voy a seguir en video 15 seccion 9

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Producto no Encontrado!."
                }
            });
        }

        res.json({
            ok: true,
            mensaje: "Producto no Disponible",
            producto: productoBD
        });


    });
});


module.exports = app;