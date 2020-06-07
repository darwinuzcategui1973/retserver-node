const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const _ = require("underscore");

let app = express();

let Producto = require('../models/productoGMD');

// ==================================
//  Obtener o lista los Productos
// ==================================
app.get('/productos', (req, res) = {
    // lista los productos
    // populate: Usuario grupo marca
    // paginado

});


// ==================================
//  Obtener un Producto por id
// ==================================
app.get('/productos/:id', verificaToken, (req, res) = {
    // Un producto
    // populate: Usuario grupo marca


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
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        img: body.img,
        // grupo,
        // marca,
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
    const arreglo = ["nombre", "precioUni", "descripcion", "img"];
    let body = _.pick(req.body, arreglo);


    //delete body.google

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, productoBD) => {

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
            producto: productoBD
        });


    });

});

// ==================================
//  Borrar un Producto
// ==================================
app.delete('/productos/:id', (req, res) = {
    // diponible pasa a falso


});






module.exports = app;