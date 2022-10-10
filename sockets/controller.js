import { Socket } from "socket.io"

// TODO: Borrar referencia a socket, solo es para ayudas en VSCode durante el desarrollo
const socketController = ( socket = new Socket() ) => {
    console.log('cliente conectado', socket.id)
}

export { socketController }