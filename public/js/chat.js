var url = (window.location.hostname.includes('localhost') ? 'http://localhost:8080/api/auth/' : 'https://restserver-nodejs-fujarte.herokuapp.com/api/auth/');

// Referencias HTML
txtUid = document.querySelector('#txtUid');
txtMensaje = document.querySelector('#txtMensaje');
ulUsuarios = document.querySelector('#ulUsuarios');
ulMensajes = document.querySelector('#ulMensajes');
btnSalir = document.querySelector('#btnSalir');

let usuario = null;
let socket = null;

// Validar token del localstorage
const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();
}

const conectarSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket conectado');
    });

    socket.on('disconnect', () => {
        console.log('Socket offline');
    });

    socket.on('recibir-mensajes', listarMensajes);

    socket.on('mensaje-privado', () => {
        
    });

    socket.on('usuarios-activos', listarUsuarios);
}

const listarUsuarios = ( usuarios = [] ) => {
    let usersHtml = '';

    usuarios.forEach( ({ nombre, uid }) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ nombre } </h5>
                    <span class="fs-6 text-muted"> ${ uid } </span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;
}

const listarMensajes = ( mensajes = [] ) => {
    let mensajesHtml = '';

    mensajes.forEach( ({ nombre, mensaje }) => {
        mensajesHtml += `
            <li>
                <p>
                    <span class="text-primary"> ${ nombre }: </span>
                    <span class="fs-6 text-muted"> ${ mensaje } </span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHtml;
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if( keyCode !== 13 ){ return; }
    if( mensaje.length === 0){ return; }

    socket.emit('enviar-mensaje', { mensaje, uid })

    txtMensaje.value = ''
})

const main = async () => {
    
    // Validar JWT
    await validarJWT();
}

main();



//