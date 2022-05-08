const express = require('express');

const controladorUsuario=require('../controllers/usuario.controller')
//middlewares

const md_autenticacion = require('../middlewares/autenticacion');
const md_rol = require('../middlewares/roles');

const api = express.Router();
api.post('/login',controladorUsuario.login)
api.post('/agregarUsuario',controladorUsuario.agregarUsuario),
api.post('/agregarAdmin',[md_autenticacion.Auth,md_rol.verAdmin],controladorUsuario.RegistrarAdmin)
api.put('/editarUsuario/:idUsuario?',[md_autenticacion.Auth],controladorUsuario.editaUsuario);
api.delete('/eliminarUsuario/:idUsuario?',[md_autenticacion.Auth],controladorUsuario.eliminarUsuario)
module.exports = api;