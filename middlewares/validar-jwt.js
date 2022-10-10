import jwt from "jsonwebtoken";
import { response, request } from "express";

import Usuario from '../models/usuario.js';

const validarJWT = async (req = request, res = response, next) => {
    // Obtener el token del header
    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            msg: "No autorizado. Falta token en la petición"
        });
    }

    try {
        // Obtener el uid del JWT
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // leer el usuario autenticado
        const usuarioAuth = await Usuario.findById({ _id: uid });

        // Verficar si existe el usuario
        if( !usuarioAuth) {
            return res.status(401).json({
                msg: "No se encontró usuario en DB"
            })
        }

        // Verficar si el estado del usuario es false
        if( !usuarioAuth.estado ) {
            return res.status(401).json({
                msg: "El token no es válido. El usuario no tiene una cuenta activa"
            })
        }
        
        req.usuarioAuth = usuarioAuth;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }

}

export { validarJWT }