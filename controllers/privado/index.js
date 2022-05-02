// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_USUARIOS = SERVER + 'private/usuarios.php?action=';

// Eventos que se ejecutan cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Petición para consultar si existen usuarios registrados.
    fetch(API_USUARIOS + 'readUsers', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si existe una sesión, de lo contrario se revisa si la respuesta es satisfactoria.
                if (response.session) {
                    location.href = 'main.html';
                } else if (response.status) {
                    sweetAlert(4, 'Debe autenticarse para ingresar', null);
                } else {
                    sweetAlert(3, response.exception, 'signup.html');
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
});