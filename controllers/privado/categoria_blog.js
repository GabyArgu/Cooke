$(document).ready(function () {
    $('#table-catalogo').DataTable({
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
});

// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_CATALOGO = SERVER + 'private/categoria_blog.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_CATALOGO);
});

//Función que se ejecuta cada vez que apretamos una tecla dentro del input #search, sirve para buscador en tiempo real
$(document).on('keyup', '#search', function () {
    var valor = $(this).val();
    if (valor != "") {
        //SearchRows se encuentra en componentes.js y mandamos la ruta de la api, el formulario el cual contiene nuestro input para buscar (id) y el input de buscar (id)
        searchRows(API_CATALOGO, 'search-form', 'search');
    }
    else {
        //Cuando el input este vacío porque borramos el texto manualmente
        readRows(API_CATALOGO);
    }
});

//Función para refrescar la tabla manualmente al darle click al botón refresh
document.getElementById('refresh').addEventListener('click', function () {
    readRows(API_CATALOGO);
    document.getElementById('search').value = "";
});

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td data-title="ID" class="nombre-categoria">${row.idCategoriaA}</td>
                <td data-title="COLOR" class="nombre-categoria">${row.nombreCategoriaA}</td>
                <td data-title="COLOR" class="nombre-categoria">${row.descripcionCategoriaA}</td>
                <td data-title="ESTADO" class="nombre-categoria">${row.estado}</td>
                <td class="botones-table">
                    <div class="acciones d-flex mx-auto">
                        <span href="" class="accion-btn" type="button"
                            data-bs-toggle="modal" data-bs-target="#modal-actualizar" onclick="openUpdate(${row.idCategoriaA})">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </span>
                        <span href="" class="accion-btn" type="button"
                            data-bs-toggle="modal" data-bs-target="#modal-eliminar" onclick="openDelete(${row.idCategoriaA})">
                            <i class="fa-solid fa-trash-can fa-lg"></i>
                        </span>
                    </div>
                </td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbody-rows').innerHTML = content;
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
document.getElementById('search-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    searchRows(API_CATALOGO, 'search-form');
});


// Función para preparar el formulario al momento de modificar un registro.
function openUpdate(id) {
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_CATALOGO + 'readOne', {
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
                    document.getElementById('u_idCB').value = response.dataset.idCategoriaA;
                    document.getElementById('u_nombreCB').value = response.dataset.nombreCategoriaA;
                    document.getElementById('u_descripcionCB').value = response.dataset.descripcionCategoriaA;
                    document.getElementById('u_estado').value = response.dataset.estado;
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('save-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_CATALOGO, 'create', 'save-form', 'modal-agregar');
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de actualizar.
document.getElementById('update-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función para actualizar el registro. Se encuentra en el archivo components.js
    saveRow(API_CATALOGO, 'update', 'update-form', 'modal-actualizar');
});

// Función para mandar el id de la row seleccionada al modal eliminar-------------------..
function openDelete(id) {
    document.getElementById('id-delete').value = id;
}

// Método manejador de eventos que se ejecuta cuando se envía el modal de eliminar-------------------..
document.getElementById('delete-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario-------------------.
    event.preventDefault();
    //Llamamos al método que se encuentra en la api y le pasamos la ruta de la API y el id del formulario dentro de nuestro modal eliminar-------------------.
    confirmDelete(API_CATALOGO, 'delete-form');
});