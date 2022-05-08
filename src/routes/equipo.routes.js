const express = require('express');

const controladorEquipo=require('../controllers/equipos.controller')
//middlewares

const md_autenticacion = require('../middlewares/autenticacion');
const md_rol = require('../middlewares/roles');

const api = express.Router();
api.post('/agregarEquipo/:idUsuario?', md_autenticacion.Auth,controladorEquipo.AgregarEquipo);
module.exports = api;