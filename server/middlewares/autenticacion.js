//importacion
const jwt = require("jsonwebtoken");

// ====================
// Verificar Token
// =====================
const verificaToken = (req, res, next) => {
  //acceder al req de header
  const token = req.header("token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la Petición",
    });
  }

  try {
    const { usuario } = jwt.verify(token, process.env.SEED);

    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      err: {
        msg: "*Token no Valido*",
        error,
      },
    });
  }
};

// ====================
// Verificar AdminRole
// =====================
const verificaAdmin_Role = (req, res, next) => {
  const usuario = req.usuario;

  if (usuario.role === "ADMIN_ROLE") {

    next();

  } else {
    
    return res.json({
      ok: false,
      msg: "El usuario no es Administrador",
    });

  }
  
};

module.exports = {
  verificaToken,
  verificaAdmin_Role,
};
