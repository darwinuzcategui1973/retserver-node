const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// obtener el esquema
let Schema = mongoose.Schema; //definir los campos de la colección y las reglas.

let estadosValidos = {
    values: ['INICIAL', 'MODIFICADO', 'NUEVO'],
    menssage: '{VALUE} no es un Estado válido'
};

let grupoSchema = new Schema({
    codigoGrupoGmd: {
        type: String,
        // unique: true,
        required: [true, "El Codigo es Necesario!"]
    },
    nombre: {
        type: String,
        required: [true, "El nombre del es Necesario"]
    },
    /*
    idUsuario: {
        type: String,

    },*/
    fotourl: {
        type: String,
        required: false

    },
    estado: {
        type: String,
        default: "INICIAL",
        enum: estadosValidos
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, {
    timestamps: true,
    versionKey: false
});
/*
grupoSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;

}
*/
grupoSchema.plugin(uniqueValidator, {
    message: '{PATH} debe Ser Unico'
});

grupoSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = mongoose.model("Grupo", grupoSchema);