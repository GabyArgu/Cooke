/*
*   Este controlador es de uso general en las páginas web del sitio público.
*   Sirve para manejar las plantillas del encabezado y pie del documento.
*/

// Constante para establecer la ruta y parámetros de comunicación con la API.
const API = SERVER + 'public/cliente.php?action=';
const API_PEDIDOS = SERVER + 'public/pedidos.php?action=';


// Función para obtener el detalle del pedido (carrito de compras).
function readOrderDetailOff() {
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
                            
                        <li class="product-item-cart">
                            <div class="item">
                                <span class="top-0 start-100 translate-middle badge quantity-badge">${row.cantidadProducto}</span>
                                <img src="${SERVER}/images/productos/${row.imagenPrincipal}" alt="" class="cart-img">
                            </div>
                            <div class="detail-box">
                                <div class="cart-product-title">${row.nombreProducto}</div>
                                <div class="cart-price">$${row.precioUnitario}</div>
                                <div class="cart-price"><span>Monto: $</span>${subtotal.toFixed(2)}</div>
                            </div>
                                        
                            <i class="fa-solid fa-xmark cd-item-remove" onclick="openDeleteDialogOff(${row.idDetallePedido})"></i>
                        </li>
                            
                        `;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('tbody-rows-off').innerHTML = content;
                    // Se muestra el total a pagar con dos decimales.
                    document.getElementById('total-off').textContent = "$"+total.toFixed(2);
                    document.getElementById('envio-off').textContent = "$2";
                    document.getElementById('pago-off').textContent = `$${(parseFloat(total.toFixed(2))+2.00).toFixed(2)}`;
                } else {
                    document.getElementById('tbody-rows-off').innerHTML = ``;
                    document.getElementById('factura-off').innerHTML = `
                    <p class="card-total-line">Subtotal<span id="total-off">$0</span></p>
                    <p class="card-total-line">Envío<span id="envio-off">$0</span></p>
                    <p class="total card-total-line">Total<span class="total" id="pago-off">$0</span></p>`;
                    document.getElementById('title-off').textContent = `${response.exception}`;
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Función para mostrar un mensaje de confirmación al momento de eliminar un producto del carrito.
function openDeleteDialogOff(id) {
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
                            readOrderDetailOff();
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