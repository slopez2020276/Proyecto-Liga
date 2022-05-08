const express = require('express');
const cors = require('cors');
const app = express();
//importaciones
const Usuario = require('./src/routes/usuario.routes');
//const Jornada = require('./src/routes/Jornadas.routes');


app.use(express.urlencoded({extended:false}));
app.use(express.json());


app.use(cors());

app.use('/api',Usuario);

module.exports = app;