// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_COMENTARIOS = SERVER + 'private/comentarios.php?action=';
const ENDPOINT_ESTADO = SERVER + 'private/estadoGeneral.php?action=readAll';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    /* Cargando propiedades de datatable */
    $('#table-comentarios-blog').DataTable({
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
    readRows(API_COMENTARIOS);
});

//Función para refrescar la tabla manualmente al darle click al botón refresh
document.getElementById('refresh').addEventListener('click', function () {
    readRows(API_COMENTARIOS);
    document.getElementById('search').value = "";
});


//Función que se ejecuta cada vez que apretamos una tecla dentro del input #search, sirve para buscador en tiempo real
$(document).on('keyup', '#search', function () {
    var valor = $(this).val();
    if (valor != "") {
        //SearchRows se encuentra en componentes.js y mandamos la ruta de la api, el formulario el cual contiene nuestro input para buscar (id) y el input de buscar (id)
        searchRows(API_COMENTARIOS, 'search-form', 'search');
    }
    else {
        //Cuando el input este vacío porque borramos el texto manualmente
        readRows(API_COMENTARIOS);
    }
});

// Función para mandar el id de la row seleccionada al modal eliminar.
function openDelete(id) {
    document.getElementById('idComentario').value = id;
}

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td>${row.tituloArticulo}</td>
                <td>${row.tituloComentario}</td>
                <td>${row.fechaComentario}</td>
                <td>${row.estado}</td>
                <td class="botones-table">
                    <div class="acciones d-flex mx-auto">
                        <span onclick="openUpdate(${row.idComentario})" class="accion-btn" type="button"
                            data-bs-toggle="modal" data-bs-target="#modal-editar">
                            <i class="fa-solid fa-pen-to-square fa-lg"></i>
                        </span>
                        <span onclick="openDelete(${row.idComentario})" class="accion-btn" type="button"
                            data-bs-toggle="modal" data-bs-target="#modal-eliminar">
                            <i class="fa-solid fa-trash-can fa-lg"></i>
                        </span>
                        <span onclick="openDetails(${row.idComentario})" class="accion-btn" type="button"
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


function openUpdate(id) {
    //Limpiamos los campos del modal
    $("#modal-editar").find(".texto-modal").val("");
    //Captura de id de reseña de reseña seleccionada
    document.getElementById('id-comentario').value = id;
    // Se asigna el título para la caja de diálogo (modal).
    document.getElementById('modal-editar-title').textContent = 'Editar comentario';
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('idComentario', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_COMENTARIOS + 'readOne', {
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
                    document.getElementById('id-comentario').textContent = response.dataset.idComentario;
                    document.getElementById('usuario-u').textContent = response.dataset.nombresCliente + " " + response.dataset.apellidosCliente;
                    document.getElementById('articulo-u').textContent = response.dataset.tituloArticulo;
                    document.getElementById('titulo-u').textContent = response.dataset.tituloComentario;
                    document.getElementById('comentario-u').textContent = response.dataset.descripcionComentario;
                    document.getElementById('fecha-u').textContent = response.dataset.fechaComentario;
                    fillSelect(ENDPOINT_ESTADO, 'estado-comentario', response.dataset.estado);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

function openDetails(id) {
    //Limpiamos los campos del modal
    $("#modal-ver").find(".texto-modal").val("");
    // Se asigna el título para la caja de diálogo (modal).
    document.getElementById('modal-title').textContent = 'Detalles';
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('idComentario', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_COMENTARIOS + 'readOneDetail', {
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
                    document.getElementById('detail-cliente').textContent = response.dataset.nombresCliente + " " + response.dataset.apellidosCliente;
                    document.getElementById('detail-articulo').textContent = response.dataset.tituloArticulo;
                    document.getElementById('detail-titulo').textContent = response.dataset.tituloComentario;
                    document.getElementById('detail-comentario').textContent = response.dataset.descripcionComentario;
                    document.getElementById('detail-fecha').textContent = response.dataset.fechaComentario; 
                    document.getElementById('detail-estado').textContent = response.dataset.estado;

                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el modal de eliminar-------------------.
document.getElementById('delete-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario-------------------.
    event.preventDefault();
    //Llamamos al método que se encuentra en la api y le pasamos la ruta de la API y el id del formulario dentro de nuestro modal eliminar-------------------.
    confirmDelete(API_COMENTARIOS, 'delete-form');
});

document.getElementById('update-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario-------------------.
    event.preventDefault();
    let action = 'update'
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js-------------------.
    saveRow(API_COMENTARIOS, action, 'update-form', 'modal-editar');
});