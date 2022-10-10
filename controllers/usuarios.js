import { response } from "express";
import bcryptjs from "bcryptjs";

import Usuario from '../models/usuario.js';

// get
const usuariosGet = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    /*const usuarios = await Usuario.find({ estado: true })
            .skip( desde )
            .limit( limite );

    const total = await Usuario.countDocuments({ estado: true });*/

    // Se anidan las promesas para que se ejecuten simultaneamente y se muestra la respuesta cuando hayan concluido
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments({ estado: true }),
        Usuario.find({ estado: true })
            .skip( desde )
            .limit( limite )
    ]);

    res.json({
        total,
        usuarios
    });
}

// post
const usuariosPost = async (req, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );            // Creacion de la instancia

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();                        // Salt. Numero de vueltas para hacer más segura la contraseña. Default: 10
    usuario.password = bcryptjs.hashSync(password, salt);       // Se encirpta la contraseña con el salt

    //Grabar registro
    await usuario.save();
    
    res.json({
        usuario
    });
}

// put
const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body

    // Validar contra la base de datos
    if( password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json({
        usuario
    });
}

// patch
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "patch API - controlador"
    });
}

// delete
const usuariosDelete = async (req, res) => {
    const { id } = req.params;
    const uid = req.uid;                // Viene desde el controller de validar-jwt

    // Borrado fisico
    // const usuario = await Usuario.findByIdAndDelete(id);

    // Cambiar estado del usuario (recomendado para mantener las referencias)
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );
    //const usuarioAuth = req.usuarioAuth;

    res.json({
        usuario,
        //usuarioAuth
    });
}

export {
    usuariosGet, 
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}