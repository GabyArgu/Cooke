// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_CATALOGO = SERVER + 'public/catalogo.php?action=';
const API_PRODUCTO = SERVER + 'public/productos.php?action=';
// Se busca en la URL las variables (parámetros) disponibles.
let params = new URLSearchParams(location.search);
// Se obtienen los datos localizados por medio de las variables.
const ID = params.get('id');
const NAME = params.get('nombre');
// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("idSubcategoria").value = ID;
    // Se llama a la función que muestra los productos de la categoría seleccionada previamente.
    readProductosSubcategoria(ID, NAME);

    //Inicializando tooltips
    $("body").tooltip({ selector: '[data-bs-toggle=tooltip]' });
});

//Función que se ejecuta cada vez que apretamos una tecla dentro del input #search, sirve para buscador en tiempo real
$(document).on('keyup', '#search', function () {
    var valor = $(this).val();
    if (valor != "") {
        //SearchRows se encuentra en componentes.js y mandamos la ruta de la api, el formulario el cual contiene nuestro input para buscar (id) y el input de buscar (id)
        searchRowsProduct(API_CATALOGO, 'search-form', 'search');
    }
    else {
        // Se llama a la función que muestra los productos de la categoría seleccionada previamente.
        readProductosSubcategoria(ID, NAME);
    }
});

function searchRowsProduct(api, form, input) {
    
    fetch(api + 'search', {
        method: 'post',
        body: new FormData(document.getElementById(form))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    let content = '';
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se crean y concatenan las tarjetas con los datos de cada categoría.
                        content += `
                            <div class="col-md-4 mx-auto my-3 product-item">
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
                    // Se agregan las tarjetas a la etiqueta div mediante su id para mostrar los productos.
                    document.getElementById('productos').innerHTML = content;
                    //sweetAlert(1, response.message, null);
                } else {
                    /* En caso de no encontrar coincidencias, limpiara el campo y se recargará la tabla */
                    sweetAlert(2, response.exception, null);
                    document.getElementById(input).value = "";
                    readProductosSubcategoria(ID, NAME);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Función para obtener y mostrar los productos de acuerdo a la subcategoría seleccionada.
function readProductosSubcategoria(id, subcategoria) {
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('idSubcategoria', id);
    // Petición para solicitar los productos de la categoría seleccionada.
    fetch(API_CATALOGO + 'readProductosSubcategoria', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    let content = '';
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se define una dirección con los datos de cada categoría para mostrar sus productos en otra página web.
                        url = `producto.html?id=${row.idProducto}&nombre=${row.nombreProducto}`;
                        // Se crean y concatenan las tarjetas con los datos de cada categoría.
                        content += `
                            <div class="col-md-4 mx-auto my-3 product-item">
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
                    // Se asigna como título la categoría de los productos.
                    document.getElementById('title').textContent = subcategoria;
                    // Se agregan las tarjetas a la etiqueta div mediante su id para mostrar los productos.
                    document.getElementById('productos').innerHTML = content;
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    document.getElementById('title').innerHTML = `${response.exception}:${subcategoria}`;
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}


// Función para obtener y mostrar los productos de acuerdo a la subcategoría seleccionada.
function readProductosPrecio(id, subcategoria) {
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('idSubcategoria', id);
    // Petición para solicitar los productos de la categoría seleccionada.
    fetch(API_CATALOGO + 'readProductosSubcategoria', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    let content = '';
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se define una dirección con los datos de cada categoría para mostrar sus productos en otra página web.
                        url = `producto.html?id=${row.idProducto}&nombre=${row.nombreProducto}`;
                        // Se crean y concatenan las tarjetas con los datos de cada categoría.
                        content += `
                            <div class="col-md-4 mx-auto my-3 product-item">
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
                    // Se asigna como título la categoría de los productos.
                    document.getElementById('title').textContent = subcategoria;
                    // Se agregan las tarjetas a la etiqueta div mediante su id para mostrar los productos.
                    document.getElementById('productos').innerHTML = content;
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    document.getElementById('title').innerHTML = `${response.exception}:${subcategoria}`;
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

// function hoverImagen(ruta){
//   document.getElementById("main-img").src=ruta;
// }
