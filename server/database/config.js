const mongoose = require('mongoose');


// conexion  a la base de datos
//mongodb+srv://darwin:Gmd123456@cluster0-wcnbe.mongodb.net/productosgmd1
// mongodb://localhost:27017/gmdproducto
/*
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log("Base de datos ONLINE");


});
ctrl+shift+u+6+0
``
*/

const dbConectar = async() => {

    try {
        await mongoose.connect(process.env.URLDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify:false
        });

        console.log("Base de datos ONLINE");
        
    } catch (error) {
        console.log(error);
        throw new Error('Erroe a la Hora de Iniciar la BD ver logs');
        
    }
    

}

module.exports = {
    dbConectar
};