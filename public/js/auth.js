const formulario = document.querySelector('form');

var url = (window.location.hostname.includes('localhost') ? 'http://localhost:8080/api/auth/' : 'https://restserver-nodejs-fujarte.herokuapp.com/api/auth/')

formulario.addEventListener('submit', ev => {
    ev.preventDefault()
    const formData = {}

    // Leer cada elemento del formulario (se ignora el btn ya que no tiene nombre)
    for (const elem of formulario.elements) {
        if(elem.name.length > 0)
            formData[elem.name] = elem.value;
    }

    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type':'application/json'}
    })
    .then( resp => resp.json() )
    .then(( { msg, usuario, token }) => {
        if( !usuario ) {
            return console.error( msg )
        }

        localStorage.setItem('token', token)
        window.location = 'chat.html'
    })
    .catch( err => {
        console.log(err);
    })
})

function handleCredentialResponse(response) {
    // Google Token: ID_TOKEN
    //console.log('id_token: ' + response.credential);
    const body = { id_token: response.credential }

    fetch( url + 'google', {
        // Configurar el método de la peticion ya que por defecto es GET
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    })
        .then( resp => resp.json() )        //Serializar el readable stream
        .then( ({ token }) => {
            localStorage.setItem('token', token)          // Almacenar localmente el correo para realizar el Sign Out
            window.location = 'chat.html'
        })
        .catch( console.warn );
}

const button = document.getElementById("google-signOut");
button.onclick = () => {
    console.log( google.accounts.id );
    google.accounts.id.disableAutoSelect();

    // Sign out. Revocar mediante el correo almacenado localmente, se borra el registro y se recarga la página
    google.accounts.id.revoke( localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
}