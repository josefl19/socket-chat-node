import { response } from "express";

import Producto from "../models/producto.js";

const obtenerProductos = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments({ estado: true }),
        Producto.find({ estado: true })
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')
            .skip( desde )
            .limit( limite )
    ]);

    res.json({
        total,
        productos
    });
}

const obtenerProductoId = async (req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById( id )
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json({
        producto
    })
}

const crearProducto = async (req, res = response) => {
    const { estado, usuario, ...body } = req.body;
    const productoBD = await Producto.findOne({ nombre: body.nombre });

    try {
        if( productoBD ) {
            return res.status(400).json({
                msg: `${ productoBD.nombre } ya existe en la base de datos`
            }); 
        }
    
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuarioAuth._id
        }
    
        const nuevoProducto = new Producto( data );
        await nuevoProducto.save();
        res.status(201).json( nuevoProducto );

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: error
        })
    }
}

const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuarioAuth._id;

    const producto = await Producto.findByIdAndUpdate( id, data, { new: true });

    res.json({
        producto
    });
}

const borrarProducto = async (req, res = response) => {
    const { id } = req.params;

    const productoEliminado = await Producto.findByIdAndUpdate( id, { estado: false}, { new: true });

    res.json(
        productoEliminado
    )
}

export { 
    crearProducto,
    obtenerProductos,
    obtenerProductoId,
    actualizarProducto,
    borrarProducto
}