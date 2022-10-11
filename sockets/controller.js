import { Socket } from "socket.io"
import { comprobarJWT } from "../helpers/generar-jwt.js";

// TODO: Borrar referencia a socket, solo es para ayudas en VSCode durante el desarrollo
const socketController = async ( socket = new Socket() ) => {
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if( !usuario ) {
        return socket.disconnect();
    }

    console.log('Se conecto', usuario.nombre);
}

export { socketController }