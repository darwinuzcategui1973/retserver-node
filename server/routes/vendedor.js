const expres = require("express");

let { verificaToken, verificaAdmin_Role } = require("../middlewares/autenticacion");

let app = expres();

const _ = require("underscore");

let Vendedor = require("../models/vendedor");

// ===============================
// Mostrar todos los Vendedors
// ===============================
app.get("/vendedor", verificaToken, (req, res) => {
    // lista los vendedors
    // de verificar token obtengo el idusuario
    // let idUsuario = req.usuario._id
    Vendedor.find({})
        .sort("nombre")
        .populate("usuario", "nombre email")
        .exec((error, vendedors) => {
            if (error) {

                return res.status(400).json({
                    ok: false,
                    error
                });

            }

            Vendedor.countDocuments({}, (error, conteo) => {
                res.json({
                    ok: true,
                    vendedors,
                    cuantosReg: conteo

                });
            });

        })

});

// ===============================
// Mostrar todos los Marcas iniciales
// ===============================
app.get('/vendedorsInicial', verificaToken, (req, res) => {

    let estado = req.query.estado || "INICIAL";
    let usuario = req.usuario._id;
    let tipo = req.usuario.role

    if (tipo == "USER_ROLE") {

        usuario = req.query.id;

    } else {
        usuario = req.usuario._id;

    }

    Vendedor.find({ usuario: usuario, estado: estado })
        .sort("codigoVendedorGmd")

    .exec((error, vendedors) => {
        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        }


        Vendedor.countDocuments({ usuario: usuario, estado: estado }, (error, conteo) => {
            res.json({
                ok: true,
                vendedors,
                estado,
                cuantosReg: conteo
            });
        });

    })

});


// ===============================
// Mostrar un vendedor por ID
// ===============================
app.get("/vendedor/:id", verificaToken, (req, res) => {
    // muestra un vendedor por su Id
    let id = req.params.id;
    console.log(id);

    // Vendedor.findById(id);
    Vendedor.findById(id, (error, vendedorBD) => {


        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        };


        if (!vendedorBD) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Vendedor no Encontrado!."
                }
            });
        }

        res.json({
            ok: true,
            vendedor: vendedorBD
        });


    });




});

// ===============================
//  Crear un Nuevo Vendedors
// ===============================
app.post("/vendedor", verificaToken, (req, res) => {
    // regresa el nuevo vendedor
    // req.usuario._id

    let body = req.body;
    let idUsuario = req.usuario._id
    let usuario = req.usuario._id

    let vendedor = new Vendedor({
        codigoVendedorGmd: body.codigoVendedorGmd,
        nombre: body.nombre,
        infVendedor: body.infVendedor,
        idUsuario,
        usuario
    });

    // proceder a grabar
    vendedor.save((error, vendedorDB) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                error
            });

        }
        if (!vendedorDB) {
            return res.status(400).json({
                ok: false,
                error
            });

        }

        res.json({
            ok: true,
            vendedor: vendedorDB
        });

    });

});

// ===============================
//  Crear un Nuevo lista deVendedors
// ===============================
app.post("/vendedorlista", [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;
    let lista = req.body.data
    console.log("Lista de vendedores")


    lista.forEach(async unItem => {
        console.log(unItem)
        let vendedor = new Vendedor({
            codigoVendedorGmd: unItem.codigoVendedorGmd,
            nombre: unItem.nombre,
            infVendedor: unItem.infVendedor,
            usuario: unItem.usuario,
            idUsuario: unItem.idUsuario

        });
        console.log(vendedor);

        await vendedor.save(async(error, vendedorBD) => {

            if (error) {

                return res.status(500).json({
                    ok: false,
                    error
                });



            }
            if (!vendedorBD) {
                return res.status(400).json({
                    ok: false,
                    error
                });

            }


        });


    });

    res.json({
        ok: true,
        vendedor: "Iniciales grabados",
        cantidadItem: lista.length
    });


});

// +++++++ FIN DE LISTA VENDEDORES +++++++++++


// ===============================
//  Actulizar  Vendedors
// ===============================
app.put('/vendedor/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    const arreglo = ["nombre"];
    let body = _.pick(req.body, arreglo);


    //delete body.google
    //findByIdAndUpdate
    //findOneAndUpdate()
    Vendedor.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, vendedorDB) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                error
            });

        };
        if (!vendedorDB) {
            return res.status(400).json({
                ok: false,
                error
            });

        };


        res.json({
            ok: true,
            vendedor: vendedorDB
        });


    });

});
// ===============================
// Eliminar un vendedor Vendedors
// ===============================

app.delete('/vendedor/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Vendedor.findByIdAndRemove(id, (error, vendedorBorrado) => {

        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        };


        if (!vendedorBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Vendedor no Encontrado!."
                }
            });
        }

        res.json({
            ok: true,
            mensaje: "Vendedor BORRADO!",

            vendedor: vendedorBorrado
        });


    });

});

module.exports = app;