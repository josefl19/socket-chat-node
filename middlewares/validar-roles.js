import { response } from "express";

const esAdminRole = ( req, res = response, next ) => {
    // Al pasar primero la validacion por el middleware validar-jwt, este middleware tiene acceso al req.usuario
    if( !req.usuarioAuth ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin haber validado el token'
        });
    }

    // validar rol
    const { rol, nombre } = req.usuarioAuth;

    if( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ nombre } no es administrador - Acción no permitida`
        })
    }

    next();
}

const tieneRole = ( ...roles ) => {
    return (req, res = response, next) => {
        // Al pasar primero la validacion por el middleware validar-jwt, este middleware tiene acceso al req.usuario
        if( !req.usuarioAuth ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin haber validado el token'
            });
        }

        if( !roles.includes(req.usuarioAuth.rol)) {
            return res.status(401).json({
                msg: `Esta acción solo esta permitida para los siguientes roles: ${ roles }`
            });
        }

        next();
    }
}

export { esAdminRole, tieneRole }