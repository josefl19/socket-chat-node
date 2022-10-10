import { response } from "express";

import Categoria from "../models/categoria.js";

const categoriaPost = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaBD = await Categoria.findOne({ nombre });

    try {
        if( categoriaBD ) {
            res.status(400).json({
                msg: `La categoria ${ categoriaBD.nombre }, ya existe`
            });
        }
    
        // Generar data para guardar
        const data = {
            nombre,
            usuario: req.usuarioAuth._id
        }
    
        const categoria = new Categoria( data );
    
        // Guardar en Mongo
        await categoria.save();
        res.status(201).json( categoria );

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error'
        })
    }
}

// obtenerCaterogias - paginado - total - populate (mongoose) relacion entre categoria y usuario
const obtenerCaterogias = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments({ estado: true }),
        Categoria.find({ estado: true }).populate('usuario', 'nombre')
            .skip( desde )
            .limit( limite )
    ]);

    res.json({
        total,
        categorias
    })
}

// obtenerCategoriaId - usando populate
const obtenerCategoriaId = async (req, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');

    res.json({
        categoria
    });
}

// actualizarCategoria - privado con cualquier rol
const actualizarCategoria = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuarioAuth._id;         // viene de validación a JWT

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } );

    res.json({
        msg: 'Categoria actualizada',
        categoria
    })
}

// borrarCategoria - estado en false
const borrarCategoria = async (req, res = response) => {
    const { id } = req.params;

    const categoriaEliminada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(
        categoriaEliminada
    );
}

export { 
    categoriaPost,
    obtenerCaterogias,
    obtenerCategoriaId,
    actualizarCategoria,
    borrarCategoria
}