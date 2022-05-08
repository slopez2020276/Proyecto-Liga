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

module.exports ={
    AgregarEquipo,

}