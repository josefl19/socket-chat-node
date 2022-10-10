
import { Schema, model } from "mongoose";

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre de usuario es obligatorio']
    },
    correo: {
        type: String,
        require: [true, 'El correo es requerido'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'La contraseña es requerida']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        require: true,
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

// Sobreescritura del método toJSON para quitar campos de la impresión mostrada en la respuesta
UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario } = this.toObject();              // Instancia actual
    usuario.uid = _id;
    return usuario;
}

// Nombre del modelo en singular, mongoose lo actualiza al plural cuando se crea
export default model( 'Usuario', UsuarioSchema )