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
                <td data-title="TOTAL">${row.montoTotal}</td>
                <td data-title="VER">
                    <a data-bs-toggle="modal" data-bs-target="#modal_detalle"
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