// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_MARCA = SERVER + 'private/marca.php?action=';
const API_PROVEEDORES = SERVER + 'private/proveedor.php?action=';
const ENDPOINT_ESTADO = SERVER + 'private/estado_general.php?action=readAll';

let table;
// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    /* Cargando propiedades de datatable */
    $('#table-marcas').DataTable({
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

    $('#table-proveedores').DataTable({
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
    readRows(API_MARCA);
    readRows2(API_PROVEEDORES);
});

/*-------------Funciones para marcas------------- */

//Función que se ejecuta cada vez que apretamos una tecla dentro del input #search, sirve para buscador en tiempo real
$(document).on('keyup', '#search', function () {
    var valor = $(this).val();
    if (valor != "") {
        //SearchRows se encuentra en componentes.js y mandamos la ruta de la api, el formulario el cual contiene nuestro input para buscar (id) y el input de buscar (id)
        searchRows(API_MARCA, 'search-form', 'search');
    }
    else {
        //Cuando el input este vacío porque borramos el texto manualmente
        readRows(API_MARCA);
    }
});

// Función para preparar el modal al momento de insertar un registro.
function openCreate() {

    //Limpiamos los campos del modal
    $("#save-modal").find("input,textarea,select").val("");

    // Se asigna el título para la caja de diálogo (modal).
    document.getElementById('modal-title').textContent = 'Agregar marca';
    //Añadimos la clase que esconde el select estado ya que todos los usuarios ingresados, tendrán el valor de activo y este se manda automaticamente
    document.getElementById('estado').classList.add('input-hide')
    document.getElementById('estado-label').classList.add('input-hide')
}

// Función para preparar el formulario al momento de modificar un registro.
function openUpdate(id) {
    //Limpiamos los campos del modal
    $("#save-modal").find("input,textarea,select").val("");
    // Se asigna el título para la caja de diálogo (modal).
    document.getElementById('modal-title').textContent = 'Actualizar marca';
    //Mostramos el campo de estado ya que se podrá modificar
    document.getElementById('estado').classList.remove('input-hide')
    document.getElementById('estado-label').classList.remove('input-hide')
    // Se establece el campo de archivo como opcional.
    document.getElementById('archivo').required = false;

    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_MARCA + 'readOne', {
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
                    document.getElementById('id').value = response.dataset.idMarca;
                    document.getElementById('nombre').value = response.dataset.nombreMarca;
                    fillSelect(ENDPOINT_ESTADO, 'estado', response.dataset.estado);

                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Función para mandar el id de la row seleccionada al modal eliminar.
function openDelete(id) {
    document.getElementById('id-delete').value = id;
    table = 1;
}


// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        //Especificamos la ruta de las imagenes de la tabla para poder cargarlas satisfactoriamente
        content += `
          <tr>
              <td><img src="${SERVER}images/marcas/${row.imagenMarca}" class="img-fluid" height="100"></td>
              <td>${row.nombreMarca}</td>
              <td class="botones-table">
                  <div class="acciones d-flex mx-auto">
                      <span onclick="openUpdate(${row.idMarca})" class="accion-btn" type="button"
                      data-bs-toggle="modal" data-bs-target="#save-modal">
                      <i class="fa-solid fa-pen-to-square"></i>
                      </span>
                      <span onclick="openDelete(${row.idMarca})" class="accion-btn" type="button"
                          data-bs-toggle="modal" data-bs-target="#modal-eliminar">
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


// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('save-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    (document.getElementById('id').value) ? action = 'update' : action = 'create';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_MARCA, action, 'save-form', 'save-modal');
});

//Función para refrescar la tabla manualmente al darle click al botón refresh
document.getElementById('refresh').addEventListener('click', function () {
    readRows(API_MARCA);
    document.getElementById('search').value = "";
});

/*-------------Funciones para proveedores------------- */

//Función que se ejecuta cada vez que apretamos una tecla dentro del input #search, sirve para buscador en tiempo real
$(document).on('keyup', '#search2', function () {
    var valor = $(this).val();
    if (valor != "") {
        //SearchRows se encuentra en componentes.js y mandamos la ruta de la api, el formulario el cual contiene nuestro input para buscar (id) y el input de buscar (id)
        searchRows2(API_PROVEEDORES, 'search-form2', 'search2');
    }
    else {
        //Cuando el input este vacío porque borramos el texto manualmente
        readRows2(API_PROVEEDORES);
    }
});

function openCreate2() {

    //Limpiamos los campos del modal
    $("#save-modal2").find("input,textarea,select").val("");

    // Se asigna el título para la caja de diálogo (modal).
    document.getElementById('modal-title2').textContent = 'Agregar proveedor';

    //Añadimos la clase que esconde el select estado ya que todos los usuarios ingresados, tendrán el valor de activo y este se manda automaticamente
    document.getElementById('estado2').classList.add('input-hide')
    document.getElementById('estado-label2').classList.add('input-hide')

}


// Función para preparar el formulario al momento de modificar un registro.
function openUpdate2(id) {
    //Limpiamos los campos del modal
    $("#save-modal2").find("input,textarea,select").val("");
    // Se asigna el título para la caja de diálogo (modal).
    document.getElementById('modal-title2').textContent = 'Actualizar proveedor';
    //Mostramos el campo de estado ya que se podrá modificar
    document.getElementById('estado2').classList.remove('input-hide')
    document.getElementById('estado-label2').classList.remove('input-hide')


    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id-prov', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PROVEEDORES + 'readOne', {
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
                    document.getElementById('id-prov').value = response.dataset.idProveedor;
                    document.getElementById('nombre-prov').value = response.dataset.nombreProveedor;
                    document.getElementById('telefono-prov').value = response.dataset.telefonoProveedor;
                    document.getElementById('direccion-prov').value = response.dataset.direccionProveedor;
                    fillSelect(ENDPOINT_ESTADO, 'estado2', response.dataset.estado);

                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Función para mandar el id de la row seleccionada al modal eliminar.
function openDelete2(id) {
    document.getElementById('id-delete').value = id;
    table = 2;
}


// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable2(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
          <tr>
              <td>${row.nombreProveedor}</td>
              <td>${row.estado}</td>
              <td class="botones-table">
                  <div class="acciones d-flex mx-auto">
                  <span onclick="openUpdate2(${row.idProveedor})" class="accion-btn" type="button"
                      data-bs-toggle="modal" data-bs-target="#save-modal2">
                      <i class="fa-solid fa-pen-to-square"></i>
                  </span>
                  <span onclick="openDelete2(${row.idProveedor})" class="accion-btn" type="button"
                      data-bs-toggle="modal" data-bs-target="#modal-eliminar">
                      <i class="fa-solid fa-trash-can fa-lg"></i>
                  </span>
                  <span onclick="openShow(${row.idProveedor})" class="accion-btn" type="button"
                      data-bs-toggle="modal" data-bs-target="#modal-ver">
                      <i class="fa-solid fa-eye"></i>
                  </span>
                  </div>
              </td>
          </tr>
      `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbody-rows2').innerHTML = content;
}


// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('save-form2').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    (document.getElementById('id-prov').value) ? action = 'update' : action = 'create';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow2(API_PROVEEDORES, action, 'save-form2', 'save-modal2');
});


// Método manejador de eventos que se ejecuta cuando se envía el modal de eliminar.
document.getElementById('delete-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    //Llamamos al método que se encuentra en la api y le pasamos la ruta de la API y el id del formulario dentro de nuestro modal eliminar
    //Evaluamos que tabla estamos manejando para hacer el delete correspondiente
    if (table == 1) {
        confirmDelete(API_MARCA, 'delete-form');
    }
    else {
        confirmDelete2(API_PROVEEDORES, 'delete-form');
    }
});

// Función para preparar el formulario al momento de visualizar un registro.
function openShow(id) {
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id-prov', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PROVEEDORES + 'readOneShow', {
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
                    document.getElementById('show-proveedor').innerText = response.dataset.nombreProveedor;
                    document.getElementById('show-direccion').innerText = response.dataset.direccionProveedor;
                    document.getElementById('show-telefono').innerText = response.dataset.telefonoProveedor;
                    document.getElementById('show-estado').innerText = response.dataset.estado;
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}



//Función para refrescar la tabla manualmente al darle click al botón refresh
document.getElementById('refresh2').addEventListener('click', function () {
    readRows2(API_PROVEEDORES);
    document.getElementById('search2').value = "";
});