// importaciones
const { response } = require("express");

const Empresa = require("../models/empresa");
const Usuario = require("../models/usuario");

// const { generarJwt } = require("../helpers/jwt");

// controlador de usuarios para separar la logica
// lista usuarios

const getTodos = async (req, res = response) => {
    
    const busqueda = req.params.termino;

    const regex = new RegExp(busqueda,'i');
        const [ usuarios,empresas ] = await Promise.all([
       
        Usuario.find({nombre:regex}),

        Empresa.find({nombre:regex})

    ]);


  res.json({
    ok: true,
    busqueda,
    usuarios,
    empresas
  });
};

const getBuscarDocumentosColeccion = async (req, res = response) => {
    
    
    const tabla    = req.params.tabla;
    const busqueda = req.params.termino;
    const regex    = new RegExp( busqueda, 'i' );

    let data = [];
   
    switch ( tabla ) {
        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
                               // .populate('usuario', 'nombre img')
                              //  .populate('hospital', 'nombre img');
        break;

        case 'empresas':
            data = await Empresa.find({ nombre: regex })
                                    .populate('usuarioADMINISTRADOR', 'nombre img');
        break;

        case 'productos':
            data = await Usuario.find({ nombre: regex });
            
        break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/empresas/productos'
            });
    }
    
    res.json({
        ok: true,
        resultados: data
    })

};


module.exports = {
  getTodos,
  getBuscarDocumentosColeccion 
};
