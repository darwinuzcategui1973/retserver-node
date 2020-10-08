const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const 
    {   imagenProducto,
        imagenUsuario,
        imagenEmpresa,
        imagenGrupo,
        imagenMarca,
        imagenVendedor } = require('../helpers/actualizar-imagen');
const fs = require('fs'); // file system
const path = require('path'); // path

// opciones por defecto
// cuando se utiliza esto todos los archivo que se cargue
// caen en req.files lo que se este subiendo
// lo coloca en objeto req.files
//app.use(fileUpload());

//fileUpload
const fileUpload = ( req, res = response ) => {
  
    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files) {
        return res.status(400).
        json({
            ok: false,
            err: {
                message: 'No fueron subidos los archivos. '
            }
        });
    }
    // El nombre del campo de entrada (es decir, "archivo") se utiliza para recuperar el archivo cargado 
    let archivo = req.files.imagen;
   
    let nombreCortado = archivo.name.split('.');
    const extesion = nombreCortado[nombreCortado.length - 1];
   

    
    // Validar tipo 
    let tiposValidos = ['empresas','grupos','marcas','productos', 'usuarios',"vendedores"];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los Tipos permitidas son ' + tiposValidos.join(', '),
                tipo
            }

        })

    }


    // Extesiones permitidas
    let extesionesValidas = ['png', 'jpg', 'gif', 'jpeg '];

    if (extesionesValidas.indexOf(extesion) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extesiones permitidas son ' + extesionesValidas.join(', '),
                ext:extesion
            }

        })

    }


    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${extesion }`;


    // Use el método mv () para colocar el archivo en algún lugar de su servidor 
    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, (err) => {
      
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //aqui imagen cargada
        switch( tipo ) {
            case 'empresas':
                imagenEmpresa(id, res, nombreArchivo);
              
        
            break;
            
            case 'grupos':
                imagenGrupo(id, res, nombreArchivo);
              
            break;
            
            case 'marcas':
                imagenMarca(id, res, nombreArchivo);
        
              
            break;
        
            case 'productos':
                imagenProducto(id, res, nombreArchivo);
        
              
            break;
        
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
        
              
            break;
        
            case 'vendedores':
                imagenVendedor(id, res, nombreArchivo);
        
              
            break;
        }
      

    });
};

module.exports = {fileUpload} ;