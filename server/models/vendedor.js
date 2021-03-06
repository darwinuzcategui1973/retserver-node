const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { collection } = require("./empresa");

// obtener el esquema
const Schema = mongoose.Schema; //definir los campos de la colección y las reglas.
const estadosValidos = {
  values: ["INICIAL", "MODIFICADO", "NUEVO"],
  menssage: "{VALUE} no es un Estado válido",
};

const vendedorSchema = new Schema(
  {
    codigoVendedorGmd: {
      type: String,
      // unique: true,
      required: [true, "El Codigo es Necesario!"],
    },
    nombre: {
      type: String,
      required: [true, "El nombre del es Necesario"],
    },

    idEmpresa: {
      type: Schema.Types.ObjectId,
      required: [true, "idEmpresa es Necesario"],
      ref: "Empresa",
    },
    disponible: {
      type: Boolean,
      default: true,
    },
    infVendedor: {
      direccion: {
        type: String,
        required: false,
      },
      telefonos: {
        // type: String,
        type: [String],
      },
      comision: {
        type: Number,
      },
      descuentoMax: {
        type: Number,
      },
    },

    fotourl: {
      type: String,
      required: false,
    },
    estado: {
      type: String,
      default: "INICIAL",
      enum: estadosValidos,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
  );

vendedorSchema.plugin(uniqueValidator, {
  message: "{PATH} debe Ser Unico",
});
vendedorSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = mongoose.model("Vendedor", vendedorSchema,"vendedores");
