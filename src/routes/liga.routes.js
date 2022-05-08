const express = require('express');

const controladorLiga=require('../controllers/liga.controller')
//middlewares

const md_autenticacion = require('../middlewares/autenticacion');
const md_rol = require('../middlewares/roles');

const api = express.Router();
api.post('/agregarLiga/:idUsuario?', md_autenticacion.Auth ,controladorLiga.AgregarLiga)
api.put('/editarLiga/:idUsuario?', md_autenticacion.Auth,controladorLiga.editarLiga)
module.exports = api;