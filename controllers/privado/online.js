/*
*   Controlador de uso general en las páginas web del sitio privado cuando se ha iniciado sesión.
*   Sirve para manejar las plantillas del encabezado y pie del documento.
*/

// Constante para establecer la ruta y parámetros de comunicación con la API.
const API = SERVER + 'private/usuarios.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    fetch(API + 'getUser', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se revisa si el usuario está autenticado, de lo contrario se envía a iniciar sesión.
                if (response.session) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se direcciona a la página web principal.
                    if (response.status) {
                        //Ponermos el nombre de usuario en nuestro sidebar y la pantalla principal
                        const user = document.getElementById("username");
                        user.innerText = response.username;
                        const avatarImg = document.getElementById("avatar-side")
                        avatarImg.src = `../../resources/img/avatares/${response.avatar}.jpg`;
                        //Comprobamos que existe el elemento, solo existe en el dashboard
                        if (document.body.contains(document.querySelector(".username2"))) {
                            const user2 = document.querySelector(".username2");
                            user2.innerText = response.username;
                        }
                    } else {
                        sweetAlert(3, response.exception, 'index.html');
                    }
                } else {
                    location.href = 'index.html';
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
    document.querySelectorAll('.sidebar .sidebar-link').forEach(function (element) {
        element.addEventListener('click', function (e) {

            let nextEl = element.nextElementSibling;
            let parentEl = element.parentElement;

            if (nextEl) {
                e.preventDefault();
                let mycollapse = new bootstrap.Collapse(nextEl);

                if (nextEl.classList.contains('show')) {
                    mycollapse.hide();

                } else {
                    mycollapse.show();

                    // find other submenus with class=show
                    var opened_submenu = parentEl.parentElement.querySelector('.submenu.show');
                    // if it exists, then close all of them
                    if (opened_submenu) {
                        new bootstrap.Collapse(opened_submenu);
                    }
                }
            }
        }); // addEventListener
    }) // forEach

});


let sidebar = document.getElementById('sidebarMenu');
function sidebarToggle() {
    if (sidebar.classList.contains('hide')) {
        sidebar.classList.add('show');
        sidebar.classList.remove('hide');
    } else {
        sidebar.classList.add('hide');
        sidebar.classList.remove('show');
    }
}

