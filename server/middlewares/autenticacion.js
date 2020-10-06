const jwt = require("jsonwebtoken");
// ====================
// Verificar Token
// =====================
/*
const verificaToken = (req, res, next) => {

    // puedo acceder al req de header asi 
    const token = req.get('token');
    // valido si hay token en la peticion
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la Petición'
        });
    }


    try {

        jwt.verify(token, process.env.SEED, (err, decoded) => {

            if (err) {
                return res.status(401).json({
                    ok: false,
                    err: {
                        msg: '*Token no Valido*',
                       // err
                    }
                    
                });
                
            }
            
    
            req.usuario = decoded.usuario;
    
            next();
    
        });
       
        
    } catch (error) {

        
        return res.status(500).json({
            ok: false,
            err: {
                msg: 'Error desconocido',
                error
            }

        });
        
    }
  
   

};

*/
// otra manera de hacer verificar token
//
const verificaToken = (req, res, next) => {

    //acceder al req de header  
    const token = req.header("token");

    // console.log(token);
    
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la Petición'
        });
    }

    try {

        const { usuario } = jwt.verify(token, process.env.SEED);
        
        req.usuario = usuario;
        // console.log(usuario);
        
        next();
        

    } catch (error) {

        return res.status(401).json({
            ok: false,
            err: {
                msg: '*Token no Valido*',
               // err
            }
            
        });
        
    }
   
};


// ====================
// Verificar AdminRole
// =====================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es Administrador'
            }

        });

    }

};

// ============================
// Verificar Token para Imagen
// ============================
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: '*Token no Valido*'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();

    });



    /*
        res.json({
            token

        });
        */

}


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}