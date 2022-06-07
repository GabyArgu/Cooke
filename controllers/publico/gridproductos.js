// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_CATALOGO = SERVER + 'public/catalogo.php?action=';
const API_PRODUCTO = SERVER + 'public/productos.php?action=';
const ENDPOINT_COLOR = SERVER + 'public/catalogo.php?action=readColor';
// Se busca en la URL las variables (parámetros) disponibles.
let params = new URLSearchParams(location.search);
// Se obtienen los datos localizados por medio de las variables.
const ID = params.get('id');
const NAME = params.get('nombre');
// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("idSubcategoria").value = ID;
    document.getElementById("idSubcategoria2").value = ID;
    // Se llama a la función que muestra los productos de la categoría seleccionada previamente.
    readProductosSubcategoria(ID, NAME);

    //Inicializando tooltips
    $("body").tooltip({ selector: '[data-bs-toggle=tooltip]' });
});



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
                                        <button type="button" class="col-6 py-2 text-center" onclick="addToCar(${row.idColorStock})" >
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
                                        <button type="button" class="col-6 py-2 text-center" onclick="addToCar(${row.idColorStock})">
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
document.getElementById('filterPrecio').addEventListener('submit', function (event){
    let maxInput = document.getElementById("precio-max").value
    let minInput = document.getElementById("precio-min").value;
    event.preventDefault();
    if(!isNaN(maxInput)||!isNaN(minInput)){
        if(maxInput == ""||minInput == "")
        {
            alert("Campos vacios")
        }
        else if(maxInput<minInput){
            document.getElementById("precio-max").value = "";
            document.getElementById("precio-min").value = "";
            alert("Campos incorrectos")
        }
        else{
            // Petición para solicitar los productos de la categoría seleccionada.
            fetch(API_CATALOGO + 'filterPrecio', {
                method: 'post',
                body: new FormData(document.getElementById("filterPrecio"))
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
                                                <button type="button" class="col-6 py-2 text-center" onclick="addToCar(${row.idColorStock})">
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
    }
    

});

document.getElementById('refreshPrecio').addEventListener('click', function (){
    document.getElementById("precio-min").value = "";
    document.getElementById("precio-max").value = "";
    readProductosSubcategoria(ID, NAME);
})


//Método para añadir al carrito sin entrar al producto
function addToCar(id){
    console.log(id);
    const data = new FormData();
    data.append('idColorStock', id);
    // Petición para agregar un producto al pedido.
    fetch(API_PEDIDOS + 'createDetailInicio', {
        method: 'post',
        headers: {
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Credentials" : true 
        },
        body: data
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
                    document.getElementById('idProducto').value = response.dataset.idProducto;    
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
                    fillSelectProducto(ENDPOINT_COLOR, 'color', response.dataset.idColor, id);
                    document.getElementById("input-stock").max = parseInt(response.dataset.stock);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

//Funcion para asignar el atributo max del input max dinámicamente
function setMaxStock(color, id) {
    let input = document.getElementById("input-stock");

    // Se define un objeto con los datos del producto seleccionado.
    const data = new FormData();
    data.append('idProducto', id);
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
                    document.getElementById('show-stock').innerText = response.dataset.stock;
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
    let selectValue = document.getElementById('color').value;
    let id = document.getElementById('idProducto').value;
    console.log(selectValue);
    setMaxStock(selectValue, id);
    document.getElementById("input-stock").value = 1;
});

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

//Funciones de validaciones
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

// function hoverImagen(ruta){
//   document.getElementById("main-img").src=ruta;
// }
