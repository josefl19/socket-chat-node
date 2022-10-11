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
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    // Conectar a una sala especial.
    // Los usuarios podran estar en una sala global, una con el socket.id (evitar ya que al recargar se pierde) y usuario.id (personalizada)
    socket.join( usuario.id );

    // Limpiar usuario cuando se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario( usuario.id )
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    })

    // Enviar mensaje
    socket.on('enviar-mensaje', ({ uid, mensaje }) => {

        if( uid ) {
            // Mensaje privado
            socket.to( uid ).emit('mensaje-privado', { de: usuario.nombre, mensaje });
        } else {
            chatMensajes.enviarMensaje( usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }
    });
}

export { socketController }