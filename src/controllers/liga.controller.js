const Liga = require('../models/liga.model');


function AgregarLiga(req,res){
    var parametros = req.body;
    var idUser= req.params.idUsuario;
    var modelLiga = new Liga();

    if (req.user.rol =='Usuario'){

        Liga.findOne({idUsuario : req.user.sub, nombre: parametros.nombre},(err,LigaEncontrada)=>{
            if(err) return res.status(500).send({message:'error en la peticion'});
            if(LigaEncontrada){
                return res.status(500).send({mensaje:'error la liga ya existe'});

            }
            modelLiga.nombre = parametros.nombre;
            modelLiga.idUsuario = req.user.sub;
            modelLiga.save((err,ligaGuardada)=>{

                if(err) return res.status(500).send({mensaje:'error ne la peticion 2'});
                if(ligaGuardada){
                        return res.status(200).send({liga:ligaGuardada})
                }else{
                    return res.status(500).send({mensaje:'error al crear La liga'})
                }
            })


        })
    
        


    }else if (req.user.rol=='ADMIN'){
        if(idUser==null){
            return res.status(500).send({mensaje:'usted como administrador debe de enviar id de un usuario'})
        }

        Liga.findOne({idUsuario : idUser, nombre: parametros.nombre},(err,LigaEncontrada)=>{
            if(err) return res.status(500).send({message:'error en la peticion'});
            if(LigaEncontrada.nombre){
                return res.status(500).send({mensaje:'error la liga ya existe'});

            }
            modelLiga.nombre = parametros.nombre;
            modelLiga.idUsuario = idUser;
            modelLiga.save((err,ligaGuardada)=>{

                if(err) return res.status(500).send({mensaje:'error ne la peticion 2'});
                if(ligaGuardada){
                        return res.status(200).send({liga:ligaGuardada})
                }else{
                    return res.status(500).send({mensaje:'error al crear La liga'})
                }
            })


        })
    }   


    


}

function editarLiga(req,res){
    var parametros = req.body;
    var idUser= req.params.idUsuario;
   

    if (req.user.rol =='Usuario'){

       Liga.findOne({ nombre: parametros.nombre},(err,LigaEncontrada)=>{
        if(err) return res.status(500).send({message:'error en la peticion'});
        if(LigaEncontrada){
            return res.status(500).send({mensaje:'el nombre de la liga ya existe por favor elija otro'});

        }else{

            Liga.findOne({idUsuario: req.user.sub},(err,ligaEncontrada1)=>{
                if(err) return res.status(500).send({message:'error en la peticion'});
                if(ligaEncontrada1){

                    Liga.findOneAndUpdate({idUsuario :ligaEncontrada1.idUsuario},parametros,{ new: true},(err,ligaActualizada)=>{
                        if(err) return res.status(500).send({message:'error en la peticion'});
                        if(ligaActualizada){
                                return res.status(200).send({liga:ligaActualizada})
                        }else{
                            return res.status(500).send({mensaje:'error al editar la liga'})
                        }
            
                       })
                }else{
                    return res.status(500).send({mensaje:'error al encontrar la liga'})
                }
            })
     
         
        }



       })
        


    }else if (req.user.rol=='ADMIN'){
        if(idUser==null){
            return res.status(500).send({mensaje:'usted como administrador debe de enviar id de un usuario'})
        }

        Liga.findOne({ nombre: parametros.nombre},(err,LigaEncontrada)=>{
            if(err) return res.status(500).send({message:'error en la peticion'});
            if(LigaEncontrada){
                return res.status(500).send({mensaje:'el nombre de la liga ya existe por favor elija otro'});
    
            }else{
                Liga.findByIdAndUpdate(idUser,parametros,{ new: true},
                    (err,LigaEditada)=>{
                        if(err) return res.status(500).send({message:'error en la peticion'});
                        if(LigaEditada){
                            return res.status(200).send({liga:LigaEditada})
                        }else{
                            return res.status(500).send({mensaje:'error al editar la liga'})
                        }
                    })
            }
    
    
    
           })
            
    
    }   


    

} 
function eliminarLiga(req,res) {

    if(req.params.nombre==null) 
    return res.status(500).send({mensaje: "envie el nombre de la liga que desea eliminar"})


      var idUsuario;

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "envie el usuario",
            });
        }
    }

    Liga.findOneAndDelete(
        { nombre: req.params.nombre,},
        (err, ligaEliminada) => {
            if (ligaEliminada == null)
                return res.status(500).send({ error: "no se encontró la liga" });
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

            return res.status(200).send({ liga: ligaEliminada });
        }
    );
   
   
 
}

function obtenerLiga(req,res){

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "Admin") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje:
                    "envie el usuario",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Liga.find({ idUsuario: idUsuario }, (err, ligasEncontradas) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (ligasEncontradas == null)
            return res.status(500).send({ eror: "No se encontraron ligas" });
        if (ligasEncontradas.length == 0)
            return res.status(500).send({ eror: "No cuenta con ligas" });

        return res.status(200).send({ ligas: ligasEncontradas });
    });
}


module.exports ={
    AgregarLiga,
    editarLiga,
    eliminarLiga,
    obtenerLiga
}