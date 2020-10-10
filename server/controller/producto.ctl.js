// importaciones
const { response } = require("express");

const Producto = require("../models/producto");

// ===============================
// Mostrar todos los Productos
// ===============================
const getProductos = async (req, res = response) => {
  
  const desde = Number(req.query.desde) || 0;
  const limit = Number(req.query.limit) || 0;
 
  // nuevo
  const idEmp = req.idEmpresa;
  const ordenado = req.header("ordenado") || 'nombre';
  const todo = Boolean(req.header("todo")) || false ;
  const activo =(todo) ? {disponible:true } : { idEmpresa:idEmp,disponible:true }
  
  const [productos, total] = await Promise.all([
    Producto.find(activo)
    .sort(ordenado)
    .populate("usuario", "nombre email")
    .populate("grupo", "nombre")
    .populate("marca", "nombre")
    .populate("vendedor_proveedor", "nombre")
    .skip(desde).limit(limit),

    Producto.countDocuments({disponible:true}),
  ]);

  res.json({
    ok: true,
    ordenado,
    productos,
    total_activo_en_Coleccion:total
  });
};

// ===============================
// Mostrar un producto por ID
// ===============================
const getUnProducto = async (req, res = response) => {
  // muestra un producto por su Id
  const id = req.params.id;

  try {
    const productoBD = await Producto.findById(id);

    if (!productoBD) {
      return res.status(400).json({
        ok: false,
        msg: "Producto no Encontrado!.",
      });
    }

    // existe producto
    res.json({
      ok: true,
      producto: productoBD,
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
//  Crear un Nuevo Productos
// ===============================
const crearProducto = async (req, res = response) => {
  
  const uid = req.usuario.usuId;
  const idEmp = req.idEmpresa;

  const producto = new Producto({
    usuario: uid,
    idEmpresa: idEmp,
    ...req.body,
  });

  try {
    const productoDB = await producto.save();

    res.json({
      ok: true,
      producto: productoDB,
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
//  Crear lista de Nuevos Productos
// ===============================
const saveAllProducto = async (req, res = response) => {
  const uid = req.usuario.usuId;
  const idEmp = req.idEmpresa;
  const lista = req.body.data;
 
   // Elimina todos Las producto de esta producto
   try {
    await Producto.deleteMany({ idEmpresa: idEmp });
  } catch (e) {
    console.log(e);
  }
 console.log(lista);
 
  try {
   
    await lista.forEach(async (unItem) => {
       
    
      let producto = new Producto({
        usuario: uid,
        idEmpresa: idEmp,
           ...unItem,
      });

      

      const productoDB = await producto.save();
     
      if (!productoDB) {
       
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
        productos: "Iniciales grabados, revisar en la coleccion si hay --:"+ lista.length,
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
//  Actulizar  Productos
// ===============================
const actualizarProducto = async(req, res = response) => {
    
    const id  = req.params.id;
    const uid = req.usuario.usuId;

    try {
        
        const producto = await Producto.findById( id );

        if ( !producto ) {
            return res.status(404).json({
                ok: true,
                msg: 'Producto no encontrado por id',
            });
        }

        const { codigoProductoGmd,idEmpresa,usuario,disponible, ...cambiosProducto } = req.body;
/*
        const cambiosProducto = {
            ...req.body,
            usuario: uid
        }
*/
        const productoActualizado = await Producto.findByIdAndUpdate( id, cambiosProducto, { new: true } );


        res.json({
            ok: true,
            producto: productoActualizado
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
// Eliminar un producto marcandolo como no disponible
// ==================================================
const borrarProducto = async (req, res = response) => {
   
    const id  = req.params.id;
    let cambioEstado = {
        "disponible": false
    };

    try {
        
        const producto = await Producto.findById( id );

        if ( !producto ) {
            return res.status(404).json({
                ok: true,
                msg: 'Producto no encontrado por id',
            });
        }

        // await Producto.findByIdAndDelete( id );
        const productoMarcado = await Producto.findByIdAndUpdate( id, cambioEstado );

        res.json({
            ok: true,
           // productoMarcado,
            msg: 'Producto borrado'
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
  getProductos,
  getUnProducto,
  crearProducto,
  saveAllProducto,
  actualizarProducto,
  borrarProducto
};

