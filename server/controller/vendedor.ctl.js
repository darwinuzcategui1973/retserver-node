// importaciones
const { response } = require("express");

const Vendedor = require("../models/vendedor");

// ===============================
// Mostrar todos los Vendedors
// ===============================
const getVendedors = async (req, res = response) => {
  
  const desde = Number(req.query.desde) || 0;
  const limit = Number(req.query.limit) || 0;
 
  // nuevo
  const idEmp = req.idEmpresa;
  const ordenado = req.header("ordenado") || 'nombre';
  const todo = Boolean(req.header("todo")) || false ;
  const activo =(todo) ? {disponible:true } : { idEmpresa:idEmp,disponible:true }
  
  const [vendedores, total] = await Promise.all([
    Vendedor.find(activo).sort(ordenado).skip(desde).limit(limit),

    Vendedor.countDocuments({disponible:true}),
  ]);

  res.json({
    ok: true,
    ordenado,
    vendedores,
    total_activo_en_Coleccion:total
  });
};

// ===============================
// Mostrar un vendedor por ID
// ===============================
const getUnVendedor = async (req, res = response) => {
  // muestra un vendedor por su Id
  const id = req.params.id;

  try {
    const vendedorBD = await Vendedor.findById(id);

    if (!vendedorBD) {
      return res.status(400).json({
        ok: false,
        msg: "Vendedor no Encontrado!.",
      });
    }

    // existe vendedor
    res.json({
      ok: true,
      vendedor: vendedorBD,
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
//  Crear un Nuevo Vendedors
// ===============================
const crearVendedor = async (req, res = response) => {
  
  const uid = req.usuario.usuId;
  const idEmp = req.idEmpresa;

  const vendedor = new Vendedor({
    usuario: uid,
    idEmpresa: idEmp,
    ...req.body,
  });

  try {
    const vendedorDB = await vendedor.save();

    res.json({
      ok: true,
      vendedor: vendedorDB,
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
//  Crear lista de Nuevos Vendedors
// ===============================
const saveAllVendedor = async (req, res = response) => {
  const uid = req.usuario.usuId;
  const idEmp = req.idEmpresa;
  const lista = req.body.data;

   // Elimina todos Las vendedor de esta vendedor
   try {
    await Vendedor.deleteMany({ idEmpresa: idEmp });
  } catch (e) {
    console.log(e);
  }
 console.log(lista);
 
  try {
   
    await lista.forEach(async (unItem) => {
       
    
      let vendedor = new Vendedor({
        usuario: uid,
        idEmpresa: idEmp,
           ...unItem,
      });

      

      const vendedorDB = await vendedor.save();
     
      if (!vendedorDB) {
       
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
        vendedors: "Iniciales grabados, revisar en la coleccion si hay --:"+ lista.length,
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
//  Actulizar  Vendedors
// ===============================
const actualizarVendedor = async(req, res = response) => {
    
    const id  = req.params.id;
    const uid = req.usuario.usuId;

    try {
        
        const vendedor = await Vendedor.findById( id );

        if ( !vendedor ) {
            return res.status(404).json({
                ok: true,
                msg: 'Vendedor no encontrado por id',
            });
        }

        const { codigoVendedorGmd,idEmpresa,usuario,disponible, ...cambiosVendedor } = req.body;
/*
        const cambiosVendedor = {
            ...req.body,
            usuario: uid
        }
*/
        const vendedorActualizado = await Vendedor.findByIdAndUpdate( id, cambiosVendedor, { new: true } );


        res.json({
            ok: true,
            vendedor: vendedorActualizado
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

// ==================================================
// Eliminar un vendedor marcandolo como no disponible
// ==================================================
const borrarVendedor = async (req, res = response) => {
   
    const id  = req.params.id;
    let cambioEstado = {
        "disponible": false
    };

    try {
        
        const vendedor = await Vendedor.findById( id );

        if ( !vendedor ) {
            return res.status(404).json({
                ok: true,
                msg: 'Vendedor no encontrado por id',
            });
        }

        // await Vendedor.findByIdAndDelete( id );
        const vendedorMarcado = await Vendedor.findByIdAndUpdate( id, cambioEstado );

        res.json({
            ok: true,
            vendedorMarcado,
            msg: 'Vendedor borrado'
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
  getVendedors,
  getUnVendedor,
  crearVendedor,
  saveAllVendedor,
  actualizarVendedor,
  borrarVendedor
};

