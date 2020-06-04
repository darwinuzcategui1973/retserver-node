const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    menssage: '{VALUE} no es un rol válido'
};

// obtener el esquema
let Schema = mongoose.Schema;

//definir los campos de la colección y las reglas.
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El Nombre es Necesario!"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El correo es Necesario"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es Obligatorio"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;

}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe Ser Unico'
});

module.exports = mongoose.model("Usuario", usuarioSchema);