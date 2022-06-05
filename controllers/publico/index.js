// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PRODUCTO = SERVER + 'public/productos.php?action=';


document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que asignan los href de las categorias.
    readCategorias();
    // Se llama a la función que muestra los productos destacados.
    readDestacados();
    function checkOwlcarousel() {
        setTimeout(function () {
            if ($('.owl-carousel .active').is(':visible')) {
                owlsliderfuction();
            } else {
                checkOwlcarousel();
            }
        }, 250);
    }
    checkOwlcarousel();
    var carousel = document.querySelector('#carouselExampleCaptions');
    var bootstrapCarousel = new bootstrap.Carousel(carousel, {interval:3000});

    $("body").tooltip({ selector: '[data-bs-toggle=tooltip]' });
});

const readCategorias=()=>{
    //Seteamos el atributo de href en cada elemento, pasando el id de la subcategoria y su respectivo nombre
    //forma 1, utilizando foreach
    var cocina = document.querySelectorAll('.categoria-cocina');
    cocina.forEach((els)=>{
        els.setAttribute("href", "categoria.html?id=1&nombre=Cocina");
    });

    //forma 2, utilizando un for normal
    var utensilios = document.querySelectorAll('.categoria-utensilios');
    for (var i=0; i < utensilios.length; i++) {
    utensilios[i].setAttribute("href", "categoria.html?id=2&nombre=Utensilios");
    }

    var elec = document.querySelectorAll('.categoria-electrodomesticos');
    for (var i=0; i < elec.length; i++) {
    elec[i].setAttribute("href", "categoria.html?id=3&nombre=Electrodomésticos");
    }

    var recetas = document.querySelectorAll('.categoria-recetas');
    for (var i=0; i < recetas.length; i++) {
    recetas[i].setAttribute("href", "categoria.html?id=4&nombre=Recetas");
    }
}
// Función para obtener y mostrar las categorías disponibles.
function readDestacados() {
    // Petición para solicitar los datos de las categorías.
    fetch(API_PRODUCTO + 'readDestacados', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es satisfactoria, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es correcta, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    let content = '';
                    let url = '';
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se define una dirección con los datos de cada categoría para mostrar sus productos en otra página web.
                        url = `producto.html?id=${row.idProducto}&nombre=${row.nombreProducto}`;
                        // Se crean y concatenan las tarjetas con los datos de cada categoría.
                        content += `
                            <div class="col product-item mx-auto">
                                <div class="product-img-content">
                                    <div class="product-img">
                                        <img src="${SERVER}images/productos/${row.imagenPrincipal}"
                                            class="img-fluid d-block mx-auto">
                                        <div class="tags">
                                            <span class="tag-new">DESTACADO</span>
                                            <span class="tag-discount">${row.descuento}%</span>
                                        </div>
                                        <div class="product-icons">
                                            <span class="destacado-icon heart-icon custom-tooltip" data-bs-customClass="custom-tooltip"
                                                data-bs-toggle="tooltip" data-bs-placement="left" title="Añadir a WishList">
                                                <i class="far fa-heart wish"></i>
                                            </span>
                                            <span onclick="openShow(${row.idProducto})" type="button" class="destacado-icon custom-tooltip quickview-icon"
                                                data-bs-toggle="tooltip" data-bs-placement="left" title="Quick View">
                                                <i class="fa fa-magnifying-glass" type="button" data-bs-toggle="modal"
                                                    data-bs-target="#modal-ver"></i>
                                            </span>
                                        </div>
                                        <button type="button" class="col-6 py-2 text-center">
                                            Añadir al carrito
                                        </button>
                                    </div>

                                    <div class="product-info p-3">
                                        <span class="product-name"><a href="producto.html?id=${row.idProducto}">${row.nombreProducto}</a></span>
                                        <span class="product-price">$ ${row.precioProducto}</span>
                                        <span class="product-before">$ ${String(parseFloat((row.precioProducto) * ((parseFloat(row.descuento)/100)+1.00)).toFixed(2))}</span>
                                        <div class="rating d-flex mt-1">
                                            <span>
                                                <i class="fa fa-star"></i>
                                            </span>
                                            <span>
                                                <i class="fa fa-star"></i>
                                            </span>
                                            <span>
                                                <i class="fa fa-star"></i>
                                            </span>
                                            <span>
                                                <i class="fa fa-star"></i>
                                            </span>
                                            <span>
                                                <i class="fa fa-star"></i>
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>`;
                    });
                    // Se agregan las tarjetas a la etiqueta div mediante su id para mostrar las categorías.
                    document.getElementById('owl0').innerHTML = content;
                } else {
                    // Se asigna al título del contenido un mensaje de error cuando no existen datos para mostrar.
                    document.getElementById('destacados-title').innerText = `${response.exception}`;
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}
// Función para preparar el formulario al momento de visualizar un registro.
function openShow(id) {
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PRODUCTO + 'readOneShow', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se inicializan los campos del formulario con los datos del registro seleccionado.  
                    document.getElementById('show-nombre').innerText = response.dataset.nombreProducto;
                    document.getElementById('show-marca').innerText = response.dataset.nombreMarca;
                    document.getElementById('show-precio').innerText = "$" + response.dataset.precioProducto;
                    document.getElementById('show-precio-before').innerText = "$" + String(parseFloat((response.dataset.precioProducto) * ((parseFloat(response.dataset.descuento)/100)+1.00)).toFixed(2));
                    document.getElementById('show-estado').innerText = response.dataset.estadoProducto;
                    document.getElementById('show-descripcion').innerText = response.dataset.descripcionProducto;
                    document.getElementById('input-stock').setAttribute = ("max", response.dataset.stock);
                    document.getElementById('show-stock').innerText = response.dataset.stock;
                    document.getElementById('show-subcategoria').innerText = response.dataset.nombreSubCategoriaP;
                    document.getElementById('show-img-main').src = `${SERVER}/images/productos/${response.dataset.imagenPrincipal}`;
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}


function owlsliderfuction(){
    $('#owl0').owlCarousel({
        loop: true,
        margin: 5,
        responsiveClass: true,
        autoplay: true,
        autoplayTimeout: 2500,
        autoplayHoverPause: true,
        nav: true,
        dots: false,
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 2,
            },
            1100: {
                items: 3,
            },
            1400: {
                items: 4,
            }
        }
    });
    
}


$('#owl1').owlCarousel({
    loop: true,
    margin: 20,
    responsiveClass: true,
    autoplay: true,
    autoplayTimeout: 2500,
    autoplayHoverPause: true,
    nav: true,
    dots: false,
    responsive: {
        0: {
            items: 1,
        },
        768: {
            items: 1,
        },
        1100: {
            items: 2,
        },
        1400: {
            items: 3,
        }
    }
});

$('#owl2').owlCarousel({
    loop: true,
    margin: 30,
    responsiveClass: true,
    autoplay: true,
    autoplayTimeout: 2500,
    autoplayHoverPause: true,
    nav: true,
    dots: false,
    responsive: {
        0: {
            items: 1,
        },
        768: {
            items: 1,
        },
        1100: {
            items: 2,
        },
        1400: {
            items: 3,
        }
    }
});

$('#owl3').owlCarousel({
    loop: true,
    margin: 30,
    responsiveClass: true,
    autoplay: true,
    autoplayTimeout: 2500,
    autoplayHoverPause: true,
    nav: true,
    dots: false,
    responsive: {
        0: {
            items: 1,
        },
        768: {
            items: 1,
        },
        1100: {
            items: 2,
        },
        1400: {
            items: 3,
        }
    }
});



// function hoverImagen(ruta) {
    
//     document.getElementById("main-img").src = ruta;
// }

const navbar = document.getElementById('navbar-home');
let navbarCollapse = document.getElementById('navbarNavDropdown');

window.addEventListener('scroll', function () {
    if (window.pageYOffset > 86) {
        navbar.classList.add('shrink', 'shadow');
    } else {
        if(!navbar.classList.contains("activado")){
            navbar.classList.remove('shrink', 'shadow');
        }
    }
});


function navbarResponsive(){
    navbar.classList.toggle('activado');
    if(navbar.classList.contains("activado") || window.pageYOffset > 86){
        navbar.classList.add('shrink');
    }else{
        navbar.classList.remove('shrink');
    }
}
