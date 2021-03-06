// importaciones
const { response } = require("express");
const Grupo = require("../models/grupo");

// ===============================
// Mostrar todos los Grupos
// ===============================
const getGrupos = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;
  const limit = Number(req.query.limit) || 0;
  // nuevo
  const idEmp = req.idEmpresa;
  const ordenado = req.header("ordenado") || "nombre";
  const todo = Boolean(req.header("todo")) || false;
  const activo = todo
    ? { disponible: true }
    : { idEmpresa: idEmp, disponible: true };

  const [grupos, total] = await Promise.all([
    Grupo.find(activo).sort(ordenado).skip(desde).limit(limit),

    Grupo.countDocuments({ disponible: true }),
  ]);

  res.json({
    ok: true,
    ordenado,
    grupos,
    total_activo_en_Coleccion: total,
  });
};

// ===============================
// Mostrar un grupo por ID
// ===============================
const getUnGrupo = async (req, res = response) => {
  // muestra un grupo por su Id
  const id = req.params.id;

  try {
    const grupoBD = await Grupo.findById(id);

    if (!grupoBD) {
      return res.status(400).json({
        ok: false,
        msg: "Grupo no Encontrado!.",
      });
    }

    // existe grupo
    res.json({
      ok: true,
      grupo: grupoBD,
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
//  Crear un Nuevo Grupos
// ===============================
const crearGrupo = async (req, res = response) => {
  const uid = req.usuario.usuId;
  const idEmp = req.idEmpresa;

  const grupo = new Grupo({
    usuario: uid,
    idEmpresa: idEmp,
    ...req.body,
  });

  try {
    const grupoDB = await grupo.save();

    res.json({
      ok: true,
      grupo: grupoDB,
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
//  Crear lista de Nuevos Grupos
// ===============================
const saveAllGrupo = async (req, res = response) => {
  const uid = req.usuario.usuId;
  const idEmp = req.idEmpresa;
  const lista = req.body.data;

  // Elimina todos los Grupo de esta empresa
  try {
    await Grupo.deleteMany({ idEmpresa: idEmp });
  } catch (e) {
    console.log(e);
  }

  try {
    await lista.forEach(async (unItem) => {
      let grupo = new Grupo({
        usuario: uid,
        idEmpresa: idEmp,
        ...unItem,
      });

      const grupoDB = await grupo.save();

      if (!grupoDB) {
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
      grupos:
        "Iniciales grabados, revisar en la coleccion si hay --:" + lista.length,
      cantidadItem: lista.length,
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
//  Actulizar  Grupos
// ===============================
const actualizarGrupo = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.usuario.usuId;

  try {
    const grupo = await Grupo.findById(id);

    if (!grupo) {
      return res.status(404).json({
        ok: true,
        msg: "Grupo no encontrado por id",
      });
    }

    const cambiosGrupo = {
      ...req.body,
      usuario: uid,
    };

    const grupoActualizado = await Grupo.findByIdAndUpdate(id, cambiosGrupo, {
      new: true,
    });

    res.json({
      ok: true,
      grupo: grupoActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

// ===============================
// Eliminar un grupo Grupos
// ===============================
const borrarGrupo = async (req, res = response) => {
  const id = req.params.id;

  try {
    const grupo = await Grupo.findById(id);

    if (!grupo) {
      return res.status(404).json({
        ok: false,
        msg: "Grupo no encontrado por id",
      });
    }

    await Grupo.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Grupo borrado",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
module.exports = {
  getGrupos,
  getUnGrupo,
  crearGrupo,
  saveAllGrupo,
  actualizarGrupo,
  borrarGrupo,
};
