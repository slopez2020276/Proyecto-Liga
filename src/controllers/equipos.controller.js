const Equipo = require('../models/equipos.model');
const Liga = require('../models/liga.model');

function AgregarEquipo(req,res){
    var parametros = req.body;
    var modelEquipo = new Equipo();
    var idUsuario;

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "envie el usuario",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Equipo.findOne({idUsuario: idUsuario, nombre: parametros.nombre},(err, equipoEncontrado) => {
        if(equipoEncontrado){
            res.status(500).send({ error : "el equipo ya existe"})
        } else{
            if(parametros.liga==null)    return res
            .status(500)
            .send({ mensaje: "Debe poner el nombre de la liga a la que quiere asignar su equipo" });
    
            Liga.findOne({nombre: parametros.liga},(err,ligaEncontrada) => {
                if(ligaEncontrada==null){
                    res.status(500).send({ error : "no existe la liga a la que usted desea asignar el equipo"})
                } else{
                    Equipo.find({idLiga: ligaEncontrada._id},(err, equiposEncontrados) => {
                        if(equiposEncontrados.length < 10){
                            if(parametros.nombre){
                                modelEquipo.nombre = parametros.nombre
                                modelEquipo.golesFavor = 0;
                                modelEquipo.golesContra = 0;
                                modelEquipo.diferenciaGoles = 0;
                                modelEquipo.partidosJugados = 0;
                                modelEquipo.puntos = 0;
                                modelEquipo.idUsuario = idUsuario;
                                modelEquipo.idLiga = ligaEncontrada._id;
                
                                modelEquipo.save((err, equipoCreado)=>{
                                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                    if (!equipoCreado)
                                        return res.status(500).send({ mensaje: "Error al crear el equipo" });
                                    return res.status(200).send({ equipo: equipoCreado });
                                })
                          
                            }else {
                                return res
                                    .status(500)
                                    .send({ mensaje: "Debe poner el nombre de el equipo que desea crear" });
                            }
                        }else{
                            return res
                            .status(500)
                            .send({ mensaje: "la liga ya llego al limite de 10 equipos" });
                        }
                    })
                }
    
            })
        }
    })


} 

function editarEquipo(req,res){
    var parametros =req.body;
    var nombreEquipo= req.params.nombre;

    if(nombreEquipo==null) return res.status(500).send({error: "debe enviar el nombre del equipo que quiere editar"})

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "envie el usuario",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Equipo.findOne({ nombre:parametros.nombre, idUsuario: idUsuario},(err, equipoRepetido) => {
        if(equipoRepetido){
            return res.status(500).send({ error: "ya hay un equipo con ese nombre, elija otro" });
        }else{
            Equipo.findOneAndUpdate({nombre:nombreEquipo,}, (parametros),{new:true}, (err, equipoEditado) => {
                if (equipoEditado == null)
                return res.status(500).send({ error: "no se encontró el equipo" });
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });


            return res.status(200).send({ equipo: equipoEditado });
            })
        }
    })

}

function eliminarEquipo (req,res){
    var idUsuario;
    nombreEquipo= req.params.nombre
    if(req.params.nombre==null) return res.status(500).send({error: "debe enviar el nombre del equipo que eliminará"})

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "envie el usuario",
            });
        }
        idUsuario = req.params.idUsuario;
    }
    Equipo.findOneAndDelete({nombre:req.params.nombre, idUsuario: idUsuario}, {nombre:req.body.nombre}, (err, equipoEditado) => {
        if (equipoEditado == null)
        return res.status(500).send({ error: "no se encontró el equipo" });
    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });


    return res.status(200).send({ equipo: equipoEditado });
    })


}

function verEquiposLiga(req,res){
    var idUsuario;

    if(req.params.liga==null) return res.status(500).send({error: "debe enviar el nombre de que liga quiere visualizar sus equipos"})


     if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "envie el usuario",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Liga.findOne({nombre: req.params.liga, idUsuario: idUsuario}, (err, ligaEncontrada)=>{
        if(!ligaEncontrada){
            return res.status(500).send({ error: "no se encontró la liga" });
        }else{
            Equipo.find({idUsuario: idUsuario, idLiga: ligaEncontrada._id}, (err, equiposEncontrados)=>{
                if(equiposEncontrados.length==0) return res.status(500).send({ mensaje: "no cuenta con equipos en esta liga" });
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

                return res.status(200).send({equipos : equiposEncontrados})
            }).select('nombre')
        }
    })

}
function LigaTabla(req,res) {
    var idUsuario;

    if(req.params.liga==null) return res.status(500).send({error: "debe enviar el nombre de que liga quiere visualizar su tabla"})


    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "envie el usuario",
            });
        }
        idUsuario = req.params.idUsuario;
    }
    Liga.findOne({nombre: req.params.liga, idUsuario: idUsuario}, (err, ligaEncontrada)=>{
        if(!ligaEncontrada){
            return res.status(500).send({ error: "no se encontró la liga" });
        }else{
            Equipo.find({idUsuario: idUsuario, idLiga: ligaEncontrada._id}, (err, equiposEncontrados)=>{
                if(equiposEncontrados.length==0) return res.status(500).send({ mensaje: "no cuenta con equipos en esta liga" });
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

                return res.status(200).send({tabla : equiposEncontrados})
            }).sort({ puntos: -1})
        }
    })
}




module.exports ={
    AgregarEquipo,
    editarEquipo,
    eliminarEquipo,
    verEquiposLiga,
    LigaTabla,
    
}