// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los productos del carrito de compras para llenar la tabla en la vista.
    readOrderDetail();
});


// Función para obtener el detalle del pedido (carrito de compras).
function readOrderDetail() {
    // Petición para solicitar los datos del pedido en proceso.
    fetch(API_PEDIDOS + 'readOrderDetail', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se declara e inicializa una variable para concatenar las filas de la tabla en la vista.
                    let content = '';
                    // Se declara e inicializa una variable para calcular el importe por cada producto.
                    let subtotal = 0;
                    // Se declara e inicializa una variable para ir sumando cada subtotal y obtener el monto final a pagar.
                    let total = 0;
                    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        subtotal = row.precioUnitario * row.cantidadProducto;
                        total += subtotal;
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                            <tr>
                                <td><img src="${SERVER}/images/productos/${row.imagenPrincipal}" alt=""></td>
                                    <td data-title="PRODUCTO">${row.nombreProducto}</td>
                                    <td data-title="COLOR">${row.colorProducto}</td>
                                    <td data-title="PRECIO">$${row.precioUnitario}</td>
                                    <td data-title="CANTIDAD">
                                        <span class="mx-auto my-auto">${row.cantidadProducto}</span>
                                    </td>
                                    <td data-title="MONTO"><span>$</span>${subtotal.toFixed(2)}</td>
                                    <td>
                                        <div class="controles">
                                            <button class="btn btn-outline-warning" onclick="openUpdateDialog(${row.idDetallePedido}, ${row.cantidadProducto}, ${row.idColorStock})" id="btn-borrar" data-bs-toggle="modal" data-bs-target="#item-modal">
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button class="btn btn-outline-warning" onclick="openDeleteDialog(${row.idDetallePedido})" type="button" id="btn-editar">
                                                <i class="fa-solid fa-trash-can fa-lg"></i>
                                            </button>
                                        </div>
                                    </td>
                            </tr>
                        `;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('tbody-rows').innerHTML = content;
                    // Se muestra el total a pagar con dos decimales.
                    document.getElementById('total').textContent = "$"+total.toFixed(2);
                    document.getElementById('envio').textContent = "$2";
                    document.getElementById('pago').textContent = `${(parseFloat(total.toFixed(2))+2.00).toFixed(2)}`;
                } else {
                    sweetAlert(4, response.exception, 'index.html');
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Función para abrir una caja de dialogo (modal) con el formulario de cambiar cantidad de producto.
function openUpdateDialog(id, quantity, color) {
    // Se inicializan los campos del formulario con los datos del registro seleccionado.
    document.getElementById('idDetalle').value = id;
    document.getElementById('idColorStock').value = color;
    document.getElementById('input-stock').value = quantity;

    let input = document.getElementById("input-stock");
    // Se define un objeto con los datos del producto seleccionado.
    const data = new FormData();
    data.append('idColorStock', color);
    // Petición para obtener los datos del producto solicitado.
    fetch(API_PEDIDOS + 'readStock', {
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

// Método manejador de eventos que se ejecuta cuando se envía el formulario de cambiar cantidad de producto.
document.getElementById('item-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Petición para actualizar la cantidad de producto.
    fetch(API_PEDIDOS + 'updateDetail', {
        method: 'post',
        body: new FormData(document.getElementById('item-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se actualiza la tabla en la vista para mostrar el cambio de la cantidad de producto.
                    readOrderDetail();
                    
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
});

// Función para mostrar un mensaje de confirmación al momento de finalizar el pedido.
function finishOrder() {
    let monto = document.getElementById("pago").innerHTML;
    
    swal({
        title: 'Aviso',
        text: '¿Está seguro de finalizar el pedido?',
        icon: 'info',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para realizar la petición respectiva, de lo contrario se muestra un mensaje.
        if (value) {
            // Se define un objeto con los datos del producto seleccionado.
            const data = new FormData();
            data.append('montoTotal', monto);
            // Petición para finalizar el pedido en proceso.
            fetch(API_PEDIDOS + 'finishOrder', {
                method: 'post',
                body: data
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            sweetAlert(1, response.message, 'index.html');
                        } else {
                            sweetAlert(2, response.exception, null);
                        }
                    });
                } else {
                    console.log(request.status + ' ' + request.statusText);
                }
            });
        } else {
            sweetAlert(4, 'Puede seguir comprando', null);
        }
    });
}

function openDeleteDialog(id) {
    swal({
        title: 'Advertencia',
        text: '¿Está seguro de remover el producto?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para realizar la petición respectiva, de lo contrario no se hace nada.
        if (value) {
            // Se define un objeto con los datos del producto seleccionado.
            const data = new FormData();
            data.append('idDetalle', id);
            // Petición para remover un producto del pedido.
            fetch(API_PEDIDOS + 'deleteDetail', {
                method: 'post',
                body: data
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            // Se cargan nuevamente las filas en la tabla de la vista después de borrar un producto del carrito.
                            readOrderDetail();
                            sweetAlert(1, response.message, null);
                        } else {
                            sweetAlert(2, response.exception, null);
                        }
                    });
                } else {
                    console.log(request.status + ' ' + request.statusText);
                }
            });
        }
    });
}

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