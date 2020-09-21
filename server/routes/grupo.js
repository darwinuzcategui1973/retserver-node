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


// ======================================================
//  Mostar todos los grupos nuevos y id
// =====================================================
app.get('/gruposInicial', verificaToken, (req, res) => {




    let estado = req.query.estado || "INICIAL";
    let usuario = req.usuario._id;
    let tipo = req.usuario.role
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
    console.log(usuario);
    //usuario: usuario,
    Grupo.find({ usuario: usuario, estado: estado })
        .sort("codigoGrupoGmd")

    .exec((error, grupos) => {
        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });

        }


        Grupo.countDocuments({ usuario: usuario, estado: estado }, (error, conteo) => {
            res.json({
                ok: true,
                grupos,
                estado,
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
app.post("/grupolista", [verificaToken, verificaAdmin_Role], (req, res) => {

    // regresa el nuevo grupo
    // req.usuario._id

    let body = req.body;
    let lista = req.body.data
    let idUsuario1 = req.usuario._id
    let usuario1 = req.usuario.nombre
    console.log(idUsuario1)
    console.log("Lista de Grupos")

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