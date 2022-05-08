const express = require('express');

const controladorEquipo=require('../controllers/equipos.controller')
//middlewares

const md_autenticacion = require('../middlewares/autenticacion');
const md_rol = require('../middlewares/roles');

const api = express.Router();
api.post('/agregarEquipo/:idUsuario?', md_autenticacion.Auth,controladorEquipo.AgregarEquipo);
api.put('/editarEquipo/:nombre/:idUsuario?',md_autenticacion.Auth,controladorEquipo.editarEquipo);
api.delete('/eliminarEquipo/:nombre/:idUsuario?', md_autenticacion.Auth, controladorEquipo.eliminarEquipo);
module.exports = api;