import { response } from "express";
import mongoose from "mongoose";

import Usuario from "../models/usuario.js";
import Categorias from "../models/categoria.js";
import Producto from "../models/producto.js";



const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
]

const buscarUsuario = async ( termino = '', res = response ) => {
    const esIDMongo = mongoose.Types.ObjectId.isValid( termino );       // Boolean

    // Busqueda si es un ID
    if( esIDMongo ) {
        const usuario = await Usuario.findById(termino);
        return res.status(200).json({
            results: ( usuario ) ? [ usuario ] : []
        })
    }

    // Busqueda por termino
    const regex = new RegExp(termino, 'i');                         // hacer flexible las busquedas (no sensitive)
    const usuarios = await Usuario.find({                           // [] si no encuentra nada
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]                                    // Filtrar solo activos
     });

    res.json({
        results: usuarios
    })
}

const buscarCategoria = async ( termino = '', res = response ) => {
    const esIDMongo = mongoose.Types.ObjectId.isValid( termino );

    if( esIDMongo ) {
        const categoria = await Categorias.findById(termino);
        return res.status(200).json({
            results: ( categoria ) ? [ categoria ] : []
        })
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categorias.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    })
}

const buscarProducto = async ( termino = '', res = response ) => {
    const esIDMongo = mongoose.Types.ObjectId.isValid( termino );

    if( esIDMongo ) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.status(200).json({
            results: ( producto ) ? [ producto ] : []
        })
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $or: [{ nombre: regex }, { descripcion: regex }],
        $and: [{ estado: true }]
     }).populate('categoria', 'nombre');

    res.json({
        results: productos
    })
}


const buscar = (req, res = response) => {
    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes(coleccion) ) {
        res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch ( coleccion ) {
        case 'usuarios':
            buscarUsuario(termino, res);
        break;

        case 'productos':
            buscarProducto(termino, res);
        break;

        case 'categorias':
            buscarCategoria(termino, res);
        break;
    
        default:
            res.status(500).json({
                msg: 'Busqueda no existente'
            })
    }
}

export { buscar }

