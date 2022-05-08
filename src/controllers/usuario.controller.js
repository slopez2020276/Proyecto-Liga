const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function RegistrarAdminDefault(){
    var usuarioModel =  new Usuario();
    usuarioModel.usuario = 'ADMIN';
    usuarioModel.password = 'deportes123';
    usuarioModel.rol= 'ADMIN';

    Usuario.find({usuario:'ADMIN'},(err,UsuarioEncontrado)=>{
        if(UsuarioEncontrado.length==0){
            bcrypt.hash('deportes123',null,null,(err,passwordEncriptada)=>{
                usuarioModel.password = passwordEncriptada;
                usuarioModel.save((err, UsuarioGuardada)=>{

                    if(err) return console.log('error en la peticion')
                     if(UsuarioGuardada){
                        
                        console.log('admin creado');
                     }else{
                         console.log('no se creo el admin ')
                     }
                });


            })

        }else{
            return console.log('el admin ya esta registrado');
        }

    })




}

function login(req,res){
    var parametros = req.body;
    Usuario.findOne({ usuario: parametros.usuario }, (err, UsuarioEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (UsuarioEncontrada) {
            bcrypt.compare(parametros.password, UsuarioEncontrada.password,
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        if (parametros.obtenerToken !== 'true') {
                            UsuarioEncontrada.password = undefined;
                            return res.status(200)
                                .send({ empresa: UsuarioEncontrada })
                        } else {

                            return res.status(200)
                                .send({ token: jwt.crearToken(UsuarioEncontrada) })
                        }
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide' });
                    }
                })
        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.' })
        }
    })

}



function agregarUsuario(req,res){
    var usuarioModel =  new Usuario();
    var parametros = req.body;
  
        
         usuarioModel.usuario = parametros.usuario;
         usuarioModel.rol = 'Usuario';
     
 
     Usuario.find({usuario : parametros.usuario},(err,UsuarioEncontrada)=>{
         if(err) return res.status(500).send({message:'error en la peticion'})
         if(UsuarioEncontrada.length == 0){
 
             bcrypt.hash(parametros.password,null,null,(err,passwordEncriptada)=>{
 
                 usuarioModel.password = passwordEncriptada;
 
                 usuarioModel.save((err,UsuarioGuardada)=>{
                     if(err) return res.status(500).send({message:'error en la peticion'});
 
                 if(UsuarioGuardada){

                     return res.status(200) .send({empresa:UsuarioGuardada})
                 }else{
                     console.log('no se creo el Usuario')
                 }
 
 
 
                 })
 
             })
         }else{
             return res.status(500).send({mensaje:'el nombre de usuario ya existe'})
         }
 
 
     })
       
 }

 function editaUsuario(req, res) {
    var idUser = req.params.idUsuario;
    var parametros = req.body;

    if (idUser== null){
        return res.status(200).send({mensaje:'por favor envie el id del usuario a editar'});
    }

    if (idUser !== req.user.sub ) return res.status(500)
        .send({ mensaje: 'No puede editar otros usuarios' });

    Usuario.findByIdAndUpdate(req.user.sub, parametros, { new: true },
        (err, empresaActualizada) => {
            if (err) return res.status(500)
                .send({ mensaje: 'Error en la peticion' });
            if (!empresaActualizada) return res.status(500)
                .send({ mensaje: 'Error al editar la empresa' });
            return res.status(200).send({ empresa: empresaActualizada })
        })
}


function eliminarUsuario (req, res){
    var idUser = req.params.idUsuario;
    
    
    if (idUser== null){
        return res.status(200).send({mensaje:'por favor envie el id del usuario a editar'});
    }
    
  
    Usuario.findOne({_id: idUser},(err, UsuarioEncontrada)=>{
  
      if(err) return res.status(500).send({message:'error en la peticion'});
      if(idUser !== req.user.sub){
          return res.status(500)
          .send({message:'no pudede eliminar este usuario'});
    }else{
      Usuario.findByIdAndDelete(req.user.sub,
          (err, empresaEliminada) => {
              if (err) return res.status(500)
                  .send({ mensaje: 'Error en la peticion' });
              if (!empresaEliminada) return res.status(500)
                  .send({ mensaje: 'Error al eliminar el Usuario' });
              return res.status(200).send({ empresa: empresaEliminada })
          })
    }  
    })
  }

  function RegistrarAdmin(req,res){
    var usuarioModel =  new Usuario();
    var parametros = req.body;
  
        
         usuarioModel.usuario = parametros.usuario;
         usuarioModel.rol = 'ADMIN';
     
 
     Usuario.find({usuario : parametros.usuario},(err,UsuarioEncontrada)=>{
         if(err) return res.status(500).send({message:'error en la peticion'})
         if(UsuarioEncontrada.length == 0){
 
             bcrypt.hash(parametros.password,null,null,(err,passwordEncriptada)=>{
 
                 usuarioModel.password = passwordEncriptada;
 
                 usuarioModel.save((err,UsuarioGuardada)=>{
                     if(err) return res.status(500).send({message:'error en la peticion'});
 
                 if(UsuarioGuardada){

                     return res.status(200) .send({empresa:UsuarioGuardada})
                 }else{
                     console.log('no se creo el Usuario')
                 }
 
 
 
                 })
 
             })
         }else{
             return res.status(500).send({mensaje:'el nombre de usuario ya existe'})
         }
 
 
     })
       
    

  }
 module.exports={
    RegistrarAdminDefault,
    login,
    agregarUsuario,
    editaUsuario,
    eliminarUsuario,
    RegistrarAdmin,
}