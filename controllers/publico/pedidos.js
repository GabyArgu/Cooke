const API_PEDIDOS = SERVER + 'public/pedidos.php?action=';

document.addEventListener('DOMContentLoaded', function () {
    readRows4(API_PEDIDOS);
});

function fillTable4(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td data-title="ORDEN">${row.idPedido}</td>
                <td data-title="FECHA">${row.fechaPedido}</td>
                <td data-title="ESTADO">${row.estadoPedido}</td>
                <td data-title="TOTAL">$${row.montoTotal}</td>
                <td data-title="VER">
                    <a onclick="openShow(${row.idPedido})" data-bs-toggle="modal" data-bs-target="#modal_detalle"
                    href="#modal_detalle">
                        <i class="fa-solid fa-eye fa-lg"></i>
                    </a>
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
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td data-title="IMAGEN"><img src="${SERVER}images/productos/${row.imagenPrincipal}" class="img-fluid" height="100"></td>
                <td data-title="PRODUCTO">${row.nombreProducto}</td>
                <td data-title="PRECIO">$${row.precioProducto}</td>
                <td data-title="CANTIDAD">${row.cantidadProducto}</td>
                <td data-title="SUBTOTAL">$${row.subtotal}</td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById(table).innerHTML = content;
}

function openShow(id) {
    // Se asigna el título para la caja de diálogo (modal).
    document.getElementById('modal-title').textContent = 'DETALLE DE PEDIDO'
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id-det', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PEDIDOS + 'readOneDPShow', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
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