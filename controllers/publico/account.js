/*
*   Este controlador es de uso general en las páginas web del sitio público.
*   Sirve para manejar las plantillas del encabezado y pie del documento.
*/

// Constante para establecer la ruta y parámetros de comunicación con la API.
const API = SERVER + 'public/cliente.php?action=';
document.addEventListener('DOMContentLoaded', function () {
    // Petición para determinar si se ha iniciado sesión.
    fetch(API + 'getUser', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se define una variable para asignar el encabezado del documento.
                let header = '';
                // Se comprueba si el usuario está autenticado para establecer el encabezado respectivo.
                if (response.session) {
                    header = `
                    <nav class="navbar fixed-top navbar-expand-lg navbar-light menu" id="navbar-home">
                    <div class=" container-fluid">
                        <a class="navbar-brand me-auto" href="index.html"><img src="../../resources/img/index/logo2.png"
                                alt="" id="logo_inicio" class="mx-auto d-block"></a>
                        <button class="navbar-toggler collapsed d-flex d-lg-none flex-column justify-content-around"
                            type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                            aria-controls="navbarText" onclick="navbarResponsive()">
                            <span class="toggler-icon top-bar"></span>
                            <span class="toggler-icon middle-bar"></span>
                            <span class="toggler-icon bottom-bar"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNavDropdown">
                            <ul class="navbar-nav ms-auto mb-2 mb-lg-0 textcolor">
                                <li class="nav-item dropdown textcolor2">
                                    <a class="nav-link dropdown" href="categoria.html" id="navbarDropdownMenuLink"
                                        role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Categorías
                                    </a>
                                    <ul class="dropdown-menu dropdown-categorias" aria-labelledby="navbarDropdownMenuLink">
                                        <li><a class="dropdown-item categoria-cocina" href="">Cocina</a></li>
                                        <li><a class="dropdown-item categoria-utensilios" href="">Utensilios</a></li>
                                        <li><a class="dropdown-item categoria-electrodomesticos" href="">Eléctrodomesticos</a></li>
                                        <li><a class="dropdown-item categoria-recetas" href="">Recetas</a></li>
                                    </ul>
                                </li>
                                <li class="nav-item textcolor2">
                                    <a class="nav-link active " aria-current="page" href="gridproductos.html">Destacados</a>
                                </li>
                                <li class="nav-item textcolor2">
                                    <a class="nav-link active" aria-current="page" href="nosotros.html">Nosotros</a>
                                </li>
                                <li class="nav-item textcolor2">
                                    <a class="nav-link active" aria-current="page" href="blog.html">Blog</a>
                                </li>
                                <li class="nav-item textcolor2">
                                    <a class="nav-link active" aria-current="page" href="contactanos.html">Contacto</a>
                                </li>
    
                                <div class="iconos-navbar">
    
                                    <li class="nav-item textcolor">
                                        <ul class="navbar-nav ms-auto">
                                            <li class="nav-item dropdown">
                                                <a class="nav-link dropdown p-0" href="#" id="navbarDropdownMenuLink" role="button"
                                                    data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i class="fa-solid  img-hover"></i>
                                                </a>
                                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                                                    <li><a class="dropdown-item" href="cuenta.html">Cuenta</a></li>
                                                    <li><a class="dropdown-item" onclick="logOut()">Cerrar Sesión</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
    
                                    <li class="nav-item textcolor">
                                        <a class="nav-link active img-hover2" aria-current="page" href="deseos.html"></a>
                                    </li>
    
                                    <li class="nav-item textcolor nav-carrito">
                                        <a class="nav-link active img-hover3 nav-carrito" aria-current="page"
                                            data-bs-toggle="offcanvas" data-bs-target="#sidebarCarrito"
                                            aria-controls="offcanvasRight"></a>
                                    </li>
                                </div>
    
                            </ul>
                        </div>
                    </div>
                </nav>
                    `;
               //Cuando la sesion no ha iniciado//
                } else {
                    header = `
                    <nav class="navbar fixed-top navbar-expand-lg navbar-light menu" id="navbar-home">
                    <div class=" container-fluid">
                        <a class="navbar-brand me-auto" href="index.html"><img src="../../resources/img/index/logo2.png"
                                alt="" id="logo_inicio" class="mx-auto d-block"></a>
                        <button class="navbar-toggler collapsed d-flex d-lg-none flex-column justify-content-around"
                            type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                            aria-controls="navbarText" onclick="navbarResponsive()">
                            <span class="toggler-icon top-bar"></span>
                            <span class="toggler-icon middle-bar"></span>
                            <span class="toggler-icon bottom-bar"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNavDropdown">
                            <ul class="navbar-nav ms-auto mb-2 mb-lg-0 textcolor">
                                <li class="nav-item dropdown textcolor2">
                                    <a class="nav-link dropdown" href="categoria.html" id="navbarDropdownMenuLink"
                                        role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Categorías
                                    </a>
                                    <ul class="dropdown-menu dropdown-categorias" aria-labelledby="navbarDropdownMenuLink">
                                        <li><a class="dropdown-item categoria-cocina" href="">Cocina</a></li>
                                        <li><a class="dropdown-item categoria-utensilios" href="">Utensilios</a></li>
                                        <li><a class="dropdown-item categoria-electrodomesticos" href="">Eléctrodomesticos</a></li>
                                        <li><a class="dropdown-item categoria-recetas" href="">Recetas</a></li>
                                    </ul>
                                </li>
                                <li class="nav-item textcolor2">
                                    <a class="nav-link active " aria-current="page" href="gridproductos.html">Destacados</a>
                                </li>
                                <li class="nav-item textcolor2">
                                    <a class="nav-link active" aria-current="page" href="nosotros.html">Nosotros</a>
                                </li>
                                <li class="nav-item textcolor2">
                                    <a class="nav-link active" aria-current="page" href="blog.html">Blog</a>
                                </li>
                                <li class="nav-item textcolor2">
                                    <a class="nav-link active" aria-current="page" href="contactanos.html">Contacto</a>
                                </li>
    
                                <div class="iconos-navbar">
    
                                    <li class="nav-item textcolor">
                                        <ul class="navbar-nav ms-auto">
                                            <li class="nav-item dropdown">
                                                <a class="nav-link dropdown p-0" href="#" id="navbarDropdownMenuLink" role="button"
                                                    data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i class="fa-solid  img-hover"></i>
                                                </a>
                                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                                                    <li><a class="dropdown-item" href="login.html">Iniciar Sesión</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
    
                                    <li class="nav-item textcolor">
                                        <a class="nav-link active img-hover2" aria-current="page" href="deseos.html"></a>
                                    </li>
    
                                    <li class="nav-item textcolor nav-carrito">
                                        <a class="nav-link active img-hover3 nav-carrito" aria-current="page"
                                            data-bs-toggle="offcanvas" data-bs-target="#sidebarCarrito"
                                            aria-controls="offcanvasRight"></a>
                                    </li>
                                </div>
    
                            </ul>
                        </div>
                    </div>
                </nav>
                    `;
                }
                // Se asigna a la página web el contenido del encabezado.
                document.querySelector('header').innerHTML = header;
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
});
