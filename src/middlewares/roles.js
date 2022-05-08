exports.verAdmin = function(req, res, next){
    if (req.user.rol !== 'ADMIN') return res.status(403).send({mensaje:'La accion a realizar solo la puede hacer un administrador jijija'})
    next();
} 

exports.verEspectador = function(req, res, next){
    if(req.user.rol !=='Usuario') return res.status(403).send({mensaje:'la accion a realizar solo la puede hacer un cliente'})

    next();

}