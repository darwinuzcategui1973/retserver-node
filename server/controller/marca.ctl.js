// importaciones
const { response } = require("express");

const {
  verificaToken,
  verificaAdmin_Role,
} = require("../middlewares/autenticacion");

const Marca = require("../models/marca");

// ===============================
// Mostrar todos los Marcas
// ===============================
const getMarcas = async (req, res = response) => {
  
  const desde = Number(req.query.desde) || 0;
  const limit = Number(req.query.limit) || 5;
  //Marca.find({  }, "codigoMarcaGmd nombre")

  const [marcas, total] = await Promise.all([
    Marca.find({}).sort("nombre").skip(desde).limit(limit),

    Marca.countDocuments({}),
  ]);

  res.json({
    ok: true,
    usuarios: marcas,
    total,
  });
};

// ===============================
// Mostrar un marca por ID
// ===============================
const getUnMarca = async (req, res = response) => {
  // muestra un marca por su Id
  const id = req.params.id;

  try {
    const marcaBD = await Marca.findById(id);

    if (!marcaBD) {
      return res.status(400).json({
        ok: false,
        msg: "Marca no Encontrado!.",
      });
    }

    // existe marca
    res.json({
      ok: true,
      marca: marcaBD,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador del Backend",
      error,
    });
  }
};

// ===============================
//  Crear un Nuevo Marcas
// ===============================
const crearMarca = async (req, res = response) => {
  const uid = req.usuario.usuId;
  const marca = new Marca({
    usuario: uid,
    ...req.body,
  });

  try {
    const marcaDB = await marca.save();

    res.json({
      ok: true,
      marca: marcaDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
      error,
    });
  }
};

// ===============================
//  Crear lista de Nuevos Marcas
// ===============================
const saveAllMarca = async (req, res = response) => {
  const uid = req.usuario.usuId;
  const lista = req.body.data;

   // await Marca.deleteMany().exec(); 
 
 
  try {
   
    await lista.forEach(async (unItem) => {
       
    
      let marca = new Marca({
        usuario: uid,
           ...unItem,
      });

      

      const marcaDB = await marca.save();
     
      if (!marcaDB) {
       
        return res.status(400).json({
          ok: false,
          error,
        });
      }


    });

    // finaliza de recorrer en vector
    // visualiza el final
    
    res.json({
        ok: true,
        marcas: "Iniciales grabados, revisar en la coleccion si hay --:"+ lista.length,
        cantidadItem: lista.length
        });

 } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
      error,
    });

  }
  
};

// ===============================
//  Actulizar  Marcas
// ===============================
const actualizarMarca = async(req, res = response) => {
    
    const id  = req.params.id;
    const uid = req.usuario.usuId;

    try {
        
        const marca = await Marca.findById( id );

        if ( !marca ) {
            return res.status(404).json({
                ok: true,
                msg: 'Marca no encontrado por id',
            });
        }

        const cambiosMarca = {
            ...req.body,
            usuario: uid
        }

        const marcaActualizado = await Marca.findByIdAndUpdate( id, cambiosMarca, { new: true } );


        res.json({
            ok: true,
            marca: marcaActualizado
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

// ===============================
// Eliminar un marca Marcas
// ===============================
const borrarMarca = async (req, res = response) => {
   
    const id  = req.params.id;

    try {
        
        const marca = await Marca.findById( id );

        if ( !marca ) {
            return res.status(404).json({
                ok: false,
                msg: 'Marca no encontrado por id',
            });
        }

        await Marca.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Marca borrado'
        }); 

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}
module.exports = {
  getMarcas,
  getUnMarca,
  crearMarca,
  saveAllMarca,
  actualizarMarca,
  borrarMarca
};

