const express = require('express');

const controladorparitdo=require('../controllers/partido.controller')
//middlewares

const md_autenticacion = require('../middlewares/autenticacion');
const md_rol = require('../middlewares/roles');

const api = express.Router();

api.post('/crearPartido/:liga/:idUsuario?', md_autenticacion.Auth, controladorparitdo.crearPartido);
module.exports = api;