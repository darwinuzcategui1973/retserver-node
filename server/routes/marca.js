const expres = require("express");

let { verificaToken, verificaAdmin_Role } = require("../middlewares/autenticacion");

let app = expres();

const _ = require("underscore");

let Marca = require("../models/marca");

// ===============================
// Mostrar todos los Marcas
// ===============================
app.get("/marca", verificaToken, (req, res) => {
    // lista los marcas
    // de verificar token obtengo el idusuario
    // let idUsuario = req.usuario._id
    Marca.find({})
        .sort("nombre")
        .populate("usuario", "nombre email")
        .exec((error, marcas) => {
            if (error) {

                return res.status(400).json({
                    ok: false,
                    error
                });

            }

            Marca.countDocuments({}, (error, conteo) => {
                res.json({
                    ok: true,
                    marcas,
                    cuantosReg: conteo

                });
            });

        })

});

// ===============================
// Mostrar un marca por ID
// ===============================
app.get("/marca/:id", verificaToken, (req, res) => {
    // muestra un marca por su Id
    let id = req.params.id;
    // Marca.findById(id);
    Marca.findById(id, (error, marcaBD) => {


        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        };


        if (!marcaBD) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Marca no Encontrado!."
                }
            });
        }

        res.json({
            ok: true,
            marca: marcaBD
        });


    });



});

// ===============================
//  Crear un Nuevo Marcas
// ===============================
app.post("/marca", verificaToken, (req, res) => {
    // regresa el nuevo marca
    // req.usuario._id

    let body = req.body;
    let usuario = req.usuario._id

    let marca = new Marca({
        codigoMarcaGmd: body.codigoMarcaGmd,
        nombre: body.nombre,
        usuario
    });

    // proceder a grabar
    marca.save((error, marcaDB) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                error
            });

        }
        if (!marcaDB) {
            return res.status(400).json({
                ok: false,
                error
            });

        }

        res.json({
            ok: true,
            marca: marcaDB
        });

    });

});

app.post("/marcalista", (req, res) => {

    // regresa el nuevo grupo
    // req.usuario._id

    let body = req.body;
    let lista = req.body.data
    console.log("Lista de Marcas")


    lista.forEach(async unItem => {
        console.log(unItem)
        let marca = new Marca({
            codigoMarcaGmd: unItem.codigoMarcaGmd,
            nombre: unItem.nombre,
            usuario: unItem.usuario


        });
        console.log(marca);

        await marca.save(async(error, marcaBD) => {

            if (error) {

                return res.status(500).json({
                    ok: false,
                    error
                });




            }
            if (!marcaBD) {
                return res.status(400).json({
                    ok: false,
                    error
                });

            }


        });


    });

    res.json({
        ok: true,
        marcas: "Iniciales grabados",
        cantidadItem: lista.length
    });


});

// +++++++ FIN DE LISTA GRUPOS +++++++++++

// ===============================
//  Actulizar  Marcas
// ===============================
app.put('/marca/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    const arreglo = ["nombre"];
    let body = _.pick(req.body, arreglo);


    //delete body.google
    //findByIdAndUpdate
    //findOneAndUpdate()
    Marca.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, marcaDB) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                error
            });

        };
        if (!marcaDB) {
            return res.status(400).json({
                ok: false,
                error
            });

        };


        res.json({
            ok: true,
            marca: marcaDB
        });


    });

});
// ===============================
// Eliminar un marca Marcas
// ===============================
app.delete('/marca/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Marca.findByIdAndRemove(id, (error, marcaBorrado) => {

        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        };


        if (!marcaBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Marca no Encontrado!."
                }
            });
        }

        res.json({
            ok: true,
            mensaje: "Marca BORRADO!",

            marca: marcaBorrado
        });


    });

});

module.exports = app;