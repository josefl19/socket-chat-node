import { response } from "express";
import bcryptjs from "bcryptjs";

import Usuario from '../models/usuario.js';
import { generarJWT } from "../helpers/generar-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";

const login = async (req, res = response) => {
    const { correo, password } = req.body;

    try {
        // Verificar si el email existe.
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ) {
            return res.status(400).json({
                msg: "Usuario o contraseñas incorrectos. Test correo"
            });
        }

        // Verificar si el usuario es activo.
        if( !usuario.estado ) {
            return res.status(400).json({
                msg: "Usuario o contraseñas incorrectos. Test estado: false"
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword ) {
            return res.status(400).json({
                msg: "Usuario o contraseñas incorrectos. Test password"
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            msg: 'Login ok',
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Contacte al administrador'
        });
    }

}

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { email, name, picture } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo: email });

        if( !usuario ) {
            // Si no existe el usuario, se crea.
            const data = {
                nombre: name,
                correo: email,
                password: 'Temp password :P',
                img: picture,
                google: true
            }

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el estado del usuario es false (cuenta borrada), negar acceso
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Usuario bloqueado/no existe. Contacte a su administrador'
            });
        }

        // Generar JWT
        const token = await generarJWT( usuario.id );

        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}

export { login, googleSignIn }