const formulario = document.getElementById('miFormulario');
const tablaDatos = document.getElementById('tablaDatos');

// Cargar datos existentes al cargar la página
fetch('data/datos.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(usuario => agregarUsuarioATabla(usuario));
    });

formulario.addEventListener('submit', function (e) {
    e.preventDefault();
    const apodo = document.getElementById('apodo').value;
    const nombre = document.getElementById('nombre').value;
    
    // Crear un objeto con los datos del usuario
    const nuevoUsuario = { apodo, nombre };

    // Agregar el nuevo usuario a la tabla
    agregarUsuarioATabla(nuevoUsuario);

    // Guardar los datos en el archivo JSON
    guardarEnGitHub(nuevoUsuario);

    // Limpiar los campos del formulario
    document.getElementById('apodo').value = '';
    document.getElementById('nombre').value = '';
});

function agregarUsuarioATabla(usuario) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${usuario.apodo}</td>
        <td>${usuario.nombre}</td>
    `;
    tablaDatos.appendChild(fila);
}

function guardarEnGitHub(usuario) {
    const accessToken = 'TU_TOKEN_DE_ACCESO';

    fetch('https://api.github.com/repos/tuusuario/tuusuario.github.io/contents/data/datos.json', {
        method: 'GET',
        headers: {
            'Authorization': `token ${accessToken}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        const datos = JSON.parse(atob(data.content));
        datos.push(usuario);
        
        fetch('https://api.github.com/repos/tuusuario/tuusuario.github.io/contents/data/datos.json', {
            method: 'PUT',
            headers: {
                'Authorization': `token ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Actualizar datos de usuarios',
                content: btoa(JSON.stringify(datos)),
                sha: data.sha,
            }),
        });
    });
}
