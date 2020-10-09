// importaciones
const { response } = require('express');

const Empresa = require('../models/empresa');

// ===========================================
//  funcion para Obtener o lista los Empresas
// ===========================================
const getEmpresas = async (req, res= response) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);


    await Empresa.find({ disponible: true })
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

};


// ==================================
//  Obtener un Empresa por id
// ==================================
const getUnaEmpresa = async (req, res= response) => {
    // muestra un grupo por su Id
    let id = req.params.id;
    console.log(id);

    // Empresa.findById(id);
    await Empresa.findById(id)
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

};


// ==================================
//  Busca Empresas por un termino
// ==================================
const getBuscarEmpresa = async (req, res) => {

    let termino = req.params.termino;
    let expresionRegular = new RegExp(termino, 'i')


    await Empresa.find({ nombre: expresionRegular, disponible: true })

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


};

// ==================================
//  Crear nuevos Empresas
// ==================================
const crearEmpresa = async(req, res = response) => {

    const uid = req.usuario.usuId;
    // console.log(uid)
    const empresa = new Empresa({ 
        usuarioADMINISTRADOR: uid,
        ...req.body 
    });

    try {
        
        const empresaDB = await empresa.save();
        

        res.json({
            ok: true,
            empresa: empresaDB
        });

    } catch (error) {
       // console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador del Backend',
            error
        })
    }
    


}
// ==================================
//  Actulizar un Empresa
// ==================================
const actualizarEmpresa = async(req, res = response) => {
    
    const id  = req.params.id;
    const { 
        codigoEmpresa, usuarioADMINISTRADOR, nombre, ...cambiosEmpresa
    } = req.body;


    try {
        
        const empresa = await Empresa.findById( id );

        if ( !empresa ) {
            return res.status(404).json({
                ok: false,
                msg: 'Empresa no encontrado por id :'+id,
            });
        }

        
        const cambios1 = {
            ...req.body,
            darwin: "hoola"
        }
        // console.log(cambios1);
        
       
       if (nombre) {
        if (empresa.nombre !== nombre) {
            const existeNombre = await Empresa.findOne({nombre});
            if (existeNombre) {
                return res.status(400).json({
                    ok:false,
                    msg:'ya existe una Empresa con este Nombre'
                });
            }
        }
     cambiosEmpresa.nombre =nombre;
     }

        const empresaActualizado = await Empresa.findByIdAndUpdate( id, cambiosEmpresa, { new: true } );


        res.json({
            ok: true,
            empresa: empresaActualizado
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
            error
        })
    }

}

// ==================================
//  Borrar un Empresa
// ==================================
const borrarEmpresa = async (req, res = response) => {
   
    const id  = req.params.id;
    let cambioEstado = {
        "disponible": false
    };

    try {
        
        const empresa = await Empresa.findById( id );

        if ( !empresa ) {
            return res.status(404).json({
                ok: true,
                msg: 'Empresa no encontrado por id',
            });
        }

        // await Empresa.findByIdAndDelete( id );
        const empresaActualizado = await Empresa.findByIdAndUpdate( id, cambioEstado );

        res.json({
            ok: true,
            msg: 'Empresa borrado'
        }); 

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}



module.exports = 
{
    getEmpresas,
    getUnaEmpresa,
    getBuscarEmpresa,
    crearEmpresa,
    actualizarEmpresa,
    borrarEmpresa
}