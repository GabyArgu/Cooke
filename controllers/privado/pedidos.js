// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PEDIDOS = SERVER + 'private/pedidos.php?action=';
const ENDPOINT_ESTADO = SERVER + 'private/estado_pedido.php?action=readAll';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    /* Cargando propiedades de datatable */
    $('#table-pedidos').DataTable({
        "info": false,
        "searching": false,
        "dom":
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'l><'col-sm-7 d-flex justify-content-end pe-3'p>>",
        "language": {
            "lengthMenu": "Mostrando _MENU_ registros",
            "paginate": {
                "next": '<i class="fa-solid fa-angle-right"></i>',
                "previous": '<i class="fa-solid fa-angle-left"></i>'
            }
        },
        "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "Todos"]]
    });
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_PEDIDOS);
});

//Función para refrescar la tabla manualmente al darle click al botón refresh
document.getElementById('refresh').addEventListener('click', function () {
    readRows(API_PEDIDOS);
    document.getElementById('search').value = "";
});


//Función que se ejecuta cada vez que apretamos una tecla dentro del input #search, sirve para buscador en tiempo real
$(document).on('keyup', '#search', function () {
    var valor = $(this).val();
    if (valor != "") {
        //SearchRows se encuentra en componentes.js y mandamos la ruta de la api, el formulario el cual contiene nuestro input para buscar (id) y el input de buscar (id)
        searchRows(API_PEDIDOS, 'search-form', 'search');
    }
    else {
        //Cuando el input este vacío porque borramos el texto manualmente
        readRows(API_PEDIDOS);
    }
});

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td>${row.idPedido}</td>
                <td>${row.nombresCliente} ${row.apellidosCliente}</td>
                <td>${row.fechaPedido}</td>
                <td>$${row.montoTotal}</td>
                <td> ${row.estadoPedido}</td>
                <td class="botones-table">
                    <div class="acciones d-flex mx-auto">
                        <span onclick="openUpdate(${row.idPedido})" class="accion-btn" type="button"
                            data-bs-toggle="modal" data-bs-target="#modal-update">
                            <i class="fa-solid fa-pen-to-square fa-lg"></i>
                        </span>
                        <span onclick="openShow(${row.idPedido})" class="accion-btn" type="button"
                            data-bs-toggle="modal" data-bs-target="#modal-ver">
                            <i class="fa-solid fa-eye fa-lg"></i>
                        </span>
                    </div>
                </td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbody-rows').innerHTML = content;
}

function fillTable3(dataset, table) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function(row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td>${row.nombreProducto}</td>
                <td>${row.precioProducto}</td>
                <td>${row.cantidadProducto}</td>
                <td>$${row.subtotal}</td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById(table).innerHTML = content;
}

function openUpdate(id) {
    //Limpiamos los campos del modal
    $("#modal-update").find(".texto-modal").val("");
    //Captura de id de reseña de reseña seleccionada
    document.getElementById('id-u').value = id;
    // Se asigna el título para la caja de diálogo (modal).
    document.getElementById('title-items-u').textContent = 'Listado de items';
    document.getElementById('pedido-title-u').textContent = 'Información de pedido'
    document.getElementById('envio-title-u').textContent = 'Información de envío'
    document.getElementById('resumen-title-u').textContent = 'Resumen de pedido'
    document.getElementById('envio-u').textContent = '$2.00';
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id-det', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PEDIDOS + 'readOne', {
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
                    document.getElementById('id-u').value = response.dataset.idPedido;
                    document.getElementById('fecha-u').textContent = response.dataset.fechaPedido;
                    document.getElementById('pago-u').textContent = response.dataset.tipoPago;
                    document.getElementById('cliente-u').textContent = response.dataset.nombresCliente + " " + response.dataset.apellidosCliente;
                    document.getElementById('direccion-u').textContent = response.dataset.direccionCliente;
                    document.getElementById('telefono-u').textContent = response.dataset.telefonoCliente;
                    document.getElementById('subtotal-u').textContent =   `$${response.dataset.montoTotal - 2.00}`;
                    document.getElementById('monto-total-u').textContent = `$${response.dataset.montoTotal}`;
                    fillSelect(ENDPOINT_ESTADO, 'estado-pedido', response.dataset.estadoPedido);
                    readRows3(API_PEDIDOS, data, 'tbody-rows-update')
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

function openShow(id) {
    //Limpiamos los campos del modal
    $("#modal-ver").find(".texto-modal").val("");
    // Se asigna el título para la caja de diálogo (modal).
    document.getElementById('title-items').textContent = 'Listado de items';
    document.getElementById('pedido-title').textContent = 'Información de pedido'
    document.getElementById('envio-title').textContent = 'Información de envío'
    document.getElementById('resumen-title').textContent = 'Resumen de pedido'
    document.getElementById('envio-det').textContent = '$2.00';
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id-det', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PEDIDOS + 'readOneShow', {
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
                    document.getElementById('id-det').textContent = response.dataset.idPedido;
                    document.getElementById('fecha-det').textContent = response.dataset.fechaPedido;
                    document.getElementById('estado-det').textContent = response.dataset.estadoPedido;
                    document.getElementById('pago-det').textContent = response.dataset.tipoPago;
                    document.getElementById('cliente-det').textContent = response.dataset.nombresCliente + " " + response.dataset.apellidosCliente;
                    document.getElementById('direccion-det').textContent = response.dataset.direccionCliente;
                    document.getElementById('telefono-det').textContent = response.dataset.telefonoCliente;
                    document.getElementById('subtotal-det').textContent = `$${response.dataset.montoTotal - 2.00}`;
                    document.getElementById('monto-total-det').textContent = `$${response.dataset.montoTotal}`;
                    readRows3(API_PEDIDOS, data, 'tbody-rows-detalle')
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}



document.getElementById('update-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    let fecha_pedido = document.getElementById("fecha-u").textContent;
    let action = 'update'
    // No permitir que un pedido en proceso sea modificado
    if(fecha_pedido == " ") {
        sweetAlert(2, "No se puede modificar un pedido en proceso", null);
    } else {
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_PEDIDOS, action, 'update-form', 'modal-update');
}
});

document.getElementById('btn-report').addEventListener('click', function () {
    // Se establece la ruta del reporte en el servidor.
    let url = SERVER + 'reports/private/ventas_dia.php';
    // Se abre el reporte en una nueva pestaña del navegador web.
    window.open(url);
});