// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_RESENAS = SERVER + 'private/resenas.php?action=';
const ENDPOINT_ESTADO = SERVER + 'private/estado_general.php?action=readAll';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    /* Cargando propiedades de datatable */
    $('#table-resenas').DataTable({
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
    readRows(API_RESENAS);
});

//Función para refrescar la tabla manualmente al darle click al botón refresh
document.getElementById('refresh').addEventListener('click', function () {
    readRows(API_RESENAS);
    document.getElementById('search').value = "";
});


//Función que se ejecuta cada vez que apretamos una tecla dentro del input #search, sirve para buscador en tiempo real
$(document).on('keyup', '#search', function () {
    var valor = $(this).val();
    if (valor != "") {
        //SearchRows se encuentra en componentes.js y mandamos la ruta de la api, el formulario el cual contiene nuestro input para buscar (id) y el input de buscar (id)
        searchRows(API_RESENAS, 'search-form', 'search');
    }
    else {
        //Cuando el input este vacío porque borramos el texto manualmente
        readRows(API_RESENAS);
    }
});

// Función para mandar el id de la row seleccionada al modal eliminar-------------------.
function openDelete(id) {
    document.getElementById('idResena').value = id;
}

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td>${row.nombreProducto}</td>
                <td>${row.tituloResena}</td>
                <td>${row.fechaResena}</td>
                <td>${row.puntajeResena}</td>
                <td>${row.estado}</td>
                <td class="botones-table">
                    <div class="acciones d-flex mx-auto">
                        <span onclick="openUpdate(${row.idResena})" class="accion-btn" type="button"
                            data-bs-toggle="modal" data-bs-target="#modal-editar">
                            <i class="fa-solid fa-pen-to-square fa-lg"></i>
                        </span>
                        <span onclick="openDelete(${row.idResena})" class="accion-btn" type="button"
                            data-bs-toggle="modal" data-bs-target="#modal-eliminar">
                            <i class="fa-solid fa-trash-can fa-lg"></i>
                        </span>
                        <span onclick="openDetails(${row.idResena})" class="accion-btn" type="button"
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
    document.getElementById('id-resena').value = id;
    // Se asigna el título para la caja de diálogo (modal).
    document.getElementById('modal-editar-title').textContent = 'Editar reseña';
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('idResena', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_RESENAS + 'readOne', {
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
                    document.getElementById('id-resena').textContent = response.dataset.idResena;
                    document.getElementById('cliente-u').textContent = response.dataset.nombresCliente + " " + response.dataset.apellidosCliente;
                    document.getElementById('producto-u').textContent = response.dataset.nombreProducto;
                    document.getElementById('puntaje-u').textContent = response.dataset.puntajeResena;
                    document.getElementById('titulo-u').textContent = response.dataset.tituloResena;
                    document.getElementById('descripcion-u').textContent = response.dataset.descripcionResena;
                    document.getElementById('fecha-u').textContent = response.dataset.fechaResena;
                    fillSelect(ENDPOINT_ESTADO, 'estado-resena', response.dataset.estado);
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
    data.append('idResena', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_RESENAS + 'readOneDetail', {
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
                    document.getElementById('cliente-det').textContent = response.dataset.nombresCliente + " " + response.dataset.apellidosCliente;
                    document.getElementById('producto-det').textContent = response.dataset.nombreProducto
                    document.getElementById('puntaje-det').textContent = response.dataset.puntajeResena;
                    document.getElementById('titulo-det').textContent = response.dataset.tituloResena;
                    document.getElementById('descripcion-det').textContent = response.dataset.descripcionResena;
                    document.getElementById('fecha-det').textContent = response.dataset.fechaResena;
                    document.getElementById('estado-det').textContent = response.dataset.estado;
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el modal de eliminar-------------------..
document.getElementById('delete-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario-------------------..
    event.preventDefault();
    //Llamamos al método que se encuentra en la api y le pasamos la ruta de la API y el id del formulario dentro de nuestro modal eliminar-------------------..
    confirmDelete(API_RESENAS, 'delete-form');
});

document.getElementById('update-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario-------------------..
    event.preventDefault();
    let action = 'update'
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js-------------------..
    saveRow(API_RESENAS, action, 'update-form', 'modal-editar');
});

console.log ("hola")