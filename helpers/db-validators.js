import Categoria from "../models/categoria.js";
import Producto from "../models/producto.js";
import Role from "../models/role.js";
import Usuario from "../models/usuario.js";

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ) {
        throw new Error(`El rol ${ rol } no existe en la base de datos`)
    }
}

const emailExiste = async(correo = '') => {
    const existEmail = await Usuario.findOne({ correo });
    if( existEmail ) {
        throw new Error(`El correo ya se encuentra registrado`)
    }
}

const existeIDUsuario = async(id) => {
    const existUsuario = await Usuario.findById(id);
    if( !existUsuario ) {
        throw new Error(`El id ${ id } no existe`)
    }
}

const existeIDCategoria = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if( !existeCategoria ) {
        throw new Error(`El id ${ id } no existe`)
    }
}

const existeIDProducto = async(id) => {
    const existeProducto = await Producto.findById(id);
    if( !existeProducto ) {
        throw new Error(`El id ${ id } no existe`)
    }
}

const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {
    const incluida = colecciones.includes(coleccion);

    if( !incluida ) {
        throw new Error(`La coleccion ${ coleccion } no es permitida`)
    }

    return true;
}

export { 
    esRolValido, 
    emailExiste, 
    existeIDUsuario, 
    existeIDCategoria,
    existeIDProducto,
    coleccionesPermitidas
}