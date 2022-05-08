const express = require('express');
const cors = require('cors');
const app = express();
//importaciones
//const Usuario = require('./src/routes/Usuario.routes');
//const Jornada = require('./src/routes/Jornadas.routes');


app.use(express.urlencoded({extended:false}));
app.use(express.json());


app.use(cors());

//app.use('/api',Usuario,Jornada);

module.exports = app;