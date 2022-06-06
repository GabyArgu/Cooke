// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PRODUCTO = SERVER + 'public/productos.php?action=';
const API_CATALOGO = SERVER + 'public/catalogo.php?action=';
const ENDPOINT_COLOR = SERVER + 'public/catalogo.php?action=readColor';

document.addEventListener('DOMContentLoaded', function () {
    // Se busca en la URL las variables (parámetros) disponibles.
    let params = new URLSearchParams(location.search);
    // Se obtienen los datos localizados por medio de las variables.
    const ID = params.get('id');
    // Se llama a la función que muestra el detalle del producto seleccionado previamente.
    readOneProducto(ID);
    // Se llama a la función que muestra los productos destacados.
    readDestacados();
    checkOwlcarousel();

    //Inicializando tooltips
    $("body").tooltip({ selector: '[data-bs-toggle=tooltip]' });
})

function checkOwlcarousel() {
    setTimeout(function () {
        if ($('.owl-carousel .active').is(':visible')) {
            owlsliderfuction();
        } else {
            checkOwlcarousel();
        }
    }, 250);
}


// Método manejador de eventos que se ejecuta cuando se envía el formulario de agregar un producto al carrito.
document.getElementById('carritoForm').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Petición para agregar un producto al pedido.
    fetch(API_PEDIDOS + 'createDetail', {
        method: 'post',
        headers: {
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Credentials" : true 
        },
        body: new FormData(document.getElementById('carritoForm'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se constata si el cliente ha iniciado sesión.
                if (response.status) {
                    sweetAlert(1, response.message, 'carrito.html');
                } else {
                    // Se verifica si el cliente ha iniciado sesión para mostrar la excepción, de lo contrario se direcciona para que se autentique. 
                    if (response.session) {
                        sweetAlert(2, response.exception, null);
                    } else {
                        sweetAlert(3, response.exception, 'login.html');
                    }
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    })
});

// Función para obtener y mostrar los datos del producto seleccionado.
function readOneProducto(id) {
    // Se define un objeto con los datos del producto seleccionado.
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del producto solicitado.
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
                    document.getElementById('idProducto').value = response.dataset.idProducto;  
                    document.getElementById('nombre').innerText = response.dataset.nombreProducto;
                    document.getElementById('marca').innerText = response.dataset.nombreMarca;
                    document.getElementById('precio').innerText = "$" + response.dataset.precioProducto;
                    document.getElementById('precio-before').innerText = "$" + String(parseFloat((response.dataset.precioProducto) * ((parseFloat(response.dataset.descuento) / 100) + 1.00)).toFixed(2));
                    document.getElementById('estado').innerText = response.dataset.estadoProducto;
                    var cocina = document.querySelectorAll('.show-descripcion');
                    cocina.forEach((els) => {
                        els.innerText = response.dataset.descripcionProducto;;
                    });
                    document.getElementById('input-stock').setAttribute = ("max", response.dataset.stock);
                    document.getElementById('stock').innerText = response.dataset.stock;
                    document.getElementById('subcategoria').innerText = response.dataset.nombreSubCategoriaP;
                    document.getElementById('img-main').src = `${SERVER}/images/productos/${response.dataset.imagenPrincipal}`;
                    fillSelectProducto(ENDPOINT_COLOR, 'color', response.dataset.idColor, id);
                    document.getElementById("input-stock").max = parseInt(response.dataset.stock);
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    document.getElementById('title').innerHTML = `${response.exception}`;
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
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
                                        <span class="product-before">$ ${String(parseFloat((row.precioProducto) * ((parseFloat(row.descuento) / 100) + 1.00)).toFixed(2))}</span>
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
                    document.getElementById('show-precio-before').innerText = "$" + String(parseFloat((response.dataset.precioProducto) * ((parseFloat(response.dataset.descuento) / 100) + 1.00)).toFixed(2));
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


function owlsliderfuction() {
    var owl = $('#owl0').owlCarousel({
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



$(".my-rating").starRating({
    totalStars: 5,
    starShape: 'rounded',
    starSize: 20,
    disableAfterRate: false,
    emptyColor: 'lightgray',
    hoverColor: '#F7DADF',
    activeColor: '#c34e8b',
    ratedColors: ['#c34e8b', '#c34e8b', '#c34e8b', '#c34e8b', '#c34e8b'],
    useGradient: false
});
//Funcion para asignar el atributo max del input max dinámicamente
function setMaxStock(color) {
    let input = document.getElementById("input-stock");
    let select = document.getElementById("color");
    let params = new URLSearchParams(location.search);

    // Se define un objeto con los datos del producto seleccionado.
    const data = new FormData();
    data.append('idProducto', params.get('id'));
    data.append('idColor', color);
    // Petición para obtener los datos del producto solicitado.
    fetch(API_CATALOGO + 'readStock', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    //Le ponemos el atributo max a nuestro input de stock para que no se pueda agregar al carrito más del stock que se tiene
                    input.max = parseInt(response.dataset.stock);
                    document.getElementById('stock').innerText = response.dataset.stock;
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}




//Función para cambiar el atributo max del input-stock al cambiar de color en el select
document.getElementById("color").addEventListener("change", function () {
    var selectValue = document.getElementById('color').value;
    console.log(selectValue);
    setMaxStock(selectValue);
    document.getElementById("input-stock").value = 1;
});

//Función que suma 1 al stock y valida que no supere el max
let sumarStock = () => {
    let input = document.getElementById("input-stock");
    let max = input.max;
    let valor = parseInt(input.value);
    if (valor + 1 > max) {
        input.value = input.value;
    }
    else {
        input.value = parseInt(input.value) + 1;
    }
}

//Función que resta 1 al stock y valida que no descienda del min
let restarStock = () => {
    let input = document.getElementById("input-stock");
    let min = input.min;
    let valor = parseInt(input.value);
    if (valor - 1 <= min) {
        input.value = input.value;
    }
    else {
        input.value = parseInt(input.value) - 1;
    }

}

//Funciones de validaciones

let validacionInputStock = () => {
    let input = document.getElementById("input-stock");
    let valor = parseInt(input.value);
    if (valor > input.max || valor <= input.min) {
        input.value = 1;
    }
}

function valideKey(evt) {

    // code is the decimal ASCII representation of the pressed key.
    var code = (evt.which) ? evt.which : evt.keyCode;

    if (code == 8) { // backspace.
        return true;
    } else if (code >= 48 && code <= 57) { // is a number.
        return true;
    } else { // other keys.
        return false;
    }
}
