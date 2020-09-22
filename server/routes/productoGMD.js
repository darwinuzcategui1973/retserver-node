const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const _ = require("underscore");


let app = express();

let Producto = require('../models/productoGMD');
const listasProductos = require('../cargarDatos/productos/productos.json');
const { forEach, isEmpty } = require('underscore');

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
        .populate("empresa", "nombre codigoEmpresa versionSistemas")
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
//  Obtener o lista los Productos
// ==================================
app.get('/productosEmpresa', verificaToken, (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    let usuario = req.usuario._id;
    let tipo = req.usuario.role
    limite = Number(limite);


    if (tipo == "USER_ROLE") {

        usuario = req.query.id;





    } else {
        usuario = req.usuario._id;


    }

    console.log(usuario);
    console.log(req.usuario.role);



    Producto.find({ usuario: usuario, disponible: true })
        .skip(desde)
        .limit(limite)
        .sort("nombre")
        .populate("empresa", "nombre codigoEmpresa versionSistemas")
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


            Producto.countDocuments({ usuario: usuario, disponible: true }, (error, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantosReg: conteo



                });
            });

        })

});

// ======================================================
//  Obtener la lista los Productos para actulizar sistema
// =====================================================
app.get('/productosActulizar', verificaToken, (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    let estado = req.query.estado || "INICIAL";
    let usuario = req.usuario._id;
    let tipo = req.usuario.role
    limite = Number(limite);
    // ESTADO VALIDOS ['INICIAL', 'MODIFICADO', 'NUEVO']
    // INICIAL: cuando se pasa por primera los datos aqui el sistema local no tiene _id
    // MODIFICADO: Cuando se modificaron precio es status o otro campo
    // NUEVO: CUANDO SE CREAR UN PRODUCTOS DESDE EL SISTEMAS GMDPTO
    //


    if (tipo == "USER_ROLE") {

        usuario = req.query.id;



    } else {
        usuario = req.usuario._id;


    }


    Producto.find({ usuario: usuario, estado: estado })
        .skip(desde)
        .limit(limite)
        .sort("codigoProductoGmd")

    .exec((error, productos) => {
        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        }


        Producto.countDocuments({ usuario: usuario, estado: estado }, (error, conteo) => {
            res.json({
                ok: true,
                productos,
                estado,
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
        .populate("empresa", "nombre codigoEmpresa versionSistemas")
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
    let role = req.usuario.role;
    // muestra un grupo por su Id

    console.log(usuario);
    console.log(role);


    let producto = new Producto({
        codigoProductoGmd: body.codigoProductoGmd,
        nombre: body.nombre,
        unidadm: body.unidadm,
        precioBss: body.precioBss,
        precioDolares: body.precioDolares,
        descripcion: body.descripcion,
        grupo: body.grupo,
        marca: body.marca,
        empresa: body.empresa,
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
//  Crear nuevos Productos por lista
// ==================================

app.post("/productosSaveAll", [verificaToken, verificaAdmin_Role], (req, res) => {


    let body = req.body;

    let usuario = req.usuario._id;
    let role = req.usuario.role;

    // Muestra el Json con los productos
    //let productosLista = listasProductos.data;
    let productosLista = req.body.data
    let valido = true;

    let estado = "INICIAL";

    // console.log(productosLista);
    // console.log(productosLista.length);
    console.log(productosLista);
    productosLista.forEach(async unProducto => {

        let {
            codigoProductoGmd,
            nombre,
            unidadm,
            precioBss,
            precioDolares,
            descripcion,
            grupo,
            marca,
            empresa,
            oferta,
            destacado,
            nuevo,
            usuario

        } = req.body;
        let params = req.body;
        params.codigoProductoGmd = unProducto.codigoProductoGmd;
        params.nombre = unProducto.nombre;
        params.unidadm = unProducto.unidadm;
        params.precioBss = unProducto.precioBss;
        params.precioDolares = unProducto.precioDolares;
        params.descripcion = unProducto.descripcion;
        params.grupo = unProducto.grupo;
        params.marca = unProducto.marca;
        params.empresa = unProducto.empresa;
        params.oferta = unProducto.oferta;
        params.destacado = unProducto.destacado;
        params.nuevo = unProducto.nuevo;
        params.usuario = unProducto.usuario;

        console.log(params.usuario);


        if (isEmpty(unProducto.nombre) || isEmpty(unProducto.codigoProductoGmd)) {
            //console.log("producto es vacio " + unProducto.nombre);

            var error = isEmpty(unProducto.nombre) || isEmpty(unProducto.codigoProductoGmd);
            valido = isEmpty(unProducto.nombre) || isEmpty(unProducto.codigoProductoGmd);
            // console.log(valido + " " + unProducto.nombre);
        };

        if (error) {
            {
                return res.status(500).json({
                    ok: false,
                    productos: unProducto.nombre,
                    mensaje: "Faltan datos",
                    error
                });


            }
        };

        // console.log(valido);



        console.log(usuario);


        if (valido) {
            let producto = new Producto({
                codigoProductoGmd: params.codigoProductoGmd,
                nombre: params.nombre,
                unidadm: params.unidadm,
                precioBss: params.precioBss,
                precioDolares: params.precioDolares,
                descripcion: params.descripcion,
                grupo: params.grupo,
                marca: params.marca,
                empresa: params.empresa,
                oferta: params.oferta,
                destacado: params.destacado,
                nuevo: params.nuevo,
                usuario: params.usuario,



            });

            // proceder a grabar
            await producto.save(async(error, productoDB) => {



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
                    productos: "Iniciales grabados",
                    cantidadItem: productosLista.length



                });





            });


        }




    });


});


// ==================================
//  Actulizar un Producto
// ==================================
app.put('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    const arreglo = ["nombre", "precioDolares", "precioBss", "descripcion", "img", "fotoUrl"];
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