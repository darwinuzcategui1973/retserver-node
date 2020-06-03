require('../config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// petición GET
app.get('/usuario', function(req, res) {
    res.json('get Usuario')
});
// petición POST
app.post('/usuario', (req, res) => {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "El nombre es Necesario"
        });

    } else {

        res.json({
            persona: body
        });

    }


});

// petición PUT
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    })
});
// petición delete
app.delete('/usuario', (req, res) => {
    res.json('delete Usuario')
});

app.listen(puerto, () => {
    console.log("Escuchando el Puerto: ", puerto);

});