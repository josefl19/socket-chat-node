import { Socket } from "socket.io"
import { comprobarJWT } from "../helpers/generar-jwt.js";
import { ChatMensajes } from "../models/chat-mensajes.js";

const chatMensajes = new ChatMensajes();

// TODO: Borrar referencia a socket, solo es para ayudas en VSCode durante el desarrollo
const socketController = async ( socket = new Socket(), io ) => {
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if( !usuario ) {
        return socket.disconnect();
    }

    // Con io se incluye la parte del broadcast, por lo que solo se emite
    chatMensajes.conectarUsuario( usuario );                // Agregar al usuario conectado
    io.emit('usuarios-activos', chatMensajes.usuariosArr);

    // Limpiar usuario cuando se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario( usuario.id )
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    })
}

export { socketController }