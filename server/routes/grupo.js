const expres = require("express");

let { verificaToken, verificaAdmin_Role } = require("../middlewares/autenticacion");

let app = expres();

const _ = require("underscore");

let Grupo = require("../models/grupo");

// ===============================
// Mostrar todos los Grupos
// ===============================
app.get("/grupo", verificaToken, (req, res) => {
    // lista los grupos
    // de verificar token obtengo el idusuario
    // let idUsuario = req.usuario._id
    Grupo.find({})
        .sort("nombre")
        .populate("usuario", "nombre email")
        .exec((error, grupos) => {
            if (error) {

                return res.status(400).json({
                    ok: false,
                    error
                });

            }

            Grupo.countDocuments({}, (error, conteo) => {
                res.json({
                    ok: true,
                    grupos,
                    cuantosReg: conteo

                });
            });

        })

});

// ===============================
// Mostrar un grupo por ID
// ===============================
app.get("/grupo/:id", verificaToken, (req, res) => {
    // muestra un grupo por su Id
    let id = req.params.id;
    console.log(id);

    // Grupo.findById(id);
    Grupo.findById(id, (error, grupoBD) => {


        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        };


        if (!grupoBD) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Grupo no Encontrado!."
                }
            });
        }

        res.json({
            ok: true,
            grupo: grupoBD
        });


    });




});

// ===============================
//  Crear un Nuevo Grupos
// ===============================
app.post("/grupo", verificaToken, (req, res) => {
    // regresa el nuevo grupo
    // req.usuario._id

    let body = req.body;
    let idUsuario = req.usuario._id
    let usuario = req.usuario._id

    let grupo = new Grupo({
        codigoGrupoGmd: body.codigoGrupoGmd,
        nombre: body.nombre,
        idUsuario,
        usuario
    });

    // proceder a grabar
    grupo.save((error, grupoDB) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                error
            });

        }
        if (!grupoDB) {
            return res.status(400).json({
                ok: false,
                error
            });

        }

        res.json({
            ok: true,
            grupo: grupoDB
        });

    });

});


// ===============================
//  Crear lista de Nuevos Grupos
// ===============================
app.post("/grupolista", (req, res) => {

    // regresa el nuevo grupo
    // req.usuario._id

    let body = req.body;
    let lista = req.body.data
    console.log("Lista de Grupos")
        //console.log(lista)
        //let idUsuario = req.usuario._id

    lista.forEach(async unItem => {
        console.log(unItem)
        let grupo = new Grupo({
            codigoGrupoGmd: unItem.codigoGrupoGmd,
            nombre: unItem.nombre,
            idUsuario: unItem.Idusuario,
            usuario: unItem.usuario


        });
        console.log(grupo);

        await grupo.save(async(error, grupoBD) => {

            if (error) {

                return res.status(500).json({
                    ok: false,
                    error
                });




            }
            if (!grupoBD) {
                return res.status(400).json({
                    ok: false,
                    error
                });

            }


        });


    });

    res.json({
        ok: true,
        grupos: "Iniciales grabados",
        cantidadItem: lista.length
    });


});

// +++++++ FIN DE LISTA GRUPOS +++++++++++


// ===============================
//  Actulizar  Grupos
// ===============================
app.put('/grupo/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    const arreglo = ["nombre"];
    let body = _.pick(req.body, arreglo);


    //delete body.google
    //findByIdAndUpdate
    //findOneAndUpdate()
    Grupo.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, grupoDB) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                error
            });

        };
        if (!grupoDB) {
            return res.status(400).json({
                ok: false,
                error
            });

        };


        res.json({
            ok: true,
            grupo: grupoDB
        });


    });

});
// ===============================
// Eliminar un grupo Grupos
// ===============================

app.delete('/grupo/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Grupo.findByIdAndRemove(id, (error, grupoBorrado) => {

        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        };


        if (!grupoBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Grupo no Encontrado!."
                }
            });
        }

        res.json({
            ok: true,
            mensaje: "Grupo BORRADO!",

            grupo: grupoBorrado
        });


    });

});

module.exports = app;