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

    socket.on('recibir-mensajes', () => {

    });

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

const main = async () => {
    
    // Validar JWT
    await validarJWT();
}

main();



//