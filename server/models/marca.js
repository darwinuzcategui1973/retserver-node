const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// obtener el esquema
let Schema = mongoose.Schema; //definir los campos de la colección y las reglas.
let estadosValidos = {
    values: ['INICIAL', 'MODIFICADO', 'NUEVO'],
    menssage: '{VALUE} no es un Estado válido'
};

let marcaSchema = new Schema({
    codigoMarcaGmd: {
        type: String,
        // unique: true,
        required: [true, "El Código de la Marca es Necesario!"]
    },
    nombre: {
        type: String,
        required: [true, "El nombre Marca es Necesario"]
    },
    fotourl: {
        type: String,
        required: false

    },
    idEmpresa: {
        type: Schema.Types.ObjectId,
        required: [true, "idEmpresa es Necesario"],
        ref: 'Empresa'
    },
    disponible: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, {
    timestamps: true,
    versionKey: false
});

marcaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe Ser Unico'
});
marcaSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = mongoose.model("Marca", marcaSchema);