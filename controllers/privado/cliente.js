// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_CLIENTE = SERVER + 'private/cliente.php?action=';
ENDPOINT_ESTADO = SERVER + 'private/estado_cliente.php?action=readAll';
flatpickr('#nacimiento', {
});

  // Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
  /* Cargando propiedades de datatable */
  $('#table-clientes').DataTable({
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
  readRows(API_CLIENTE);
});

//Función para refrescar la tabla manualmente al darle click al botón refresh
document.getElementById('refresh').addEventListener('click', function () {
  readRows(API_CLIENTE);
  document.getElementById('search').value = "";
});

//Función que se ejecuta cada vez que apretamos una tecla dentro del input #search, sirve para buscador en tiempo real
$(document).on('keyup', '#search', function () {
  var valor = $(this).val();
  if (valor != "") {
      //SearchRows se encuentra en componentes.js y mandamos la ruta de la api, el formulario el cual contiene nuestro input para buscar (id) y el input de buscar (id)
      searchRows(API_CLIENTE, 'search-form', 'search');
  }
  else {
      //Cuando el input este vacío porque borramos el texto manualmente
      readRows(API_CLIENTE);
  }
});

//Función que se ejecuta cada vez que apretamos una tecla dentro del input #search, sirve para buscador en tiempo real
$(document).on('keyup', '#search', function () {
  var valor = $(this).val();
  if (valor != "") {
      //SearchRows se encuentra en componentes.js y mandamos la ruta de la api, el formulario el cual contiene nuestro input para buscar (id) y el input de buscar (id)
      searchRows(API_CLIENTE, 'search-form', 'search');
  }
  else {
      //Cuando el input este vacío porque borramos el texto manualmente
      readRows(API_CLIENTE);
  }
});

// Función para preparar el modal al momento de insertar un registro.
function openCreate() {

  //Limpiamos los campos del modal
  $("#save-modal").find("input,textarea,select").val("");

  // Se asigna el título para la caja de diálogo (modal).
  document.getElementById('modal-title').textContent = 'Agregar empleado';
  // Se habilitan los campos de alias y contraseña.
  document.getElementById('alias').disabled = false;
  document.getElementById('clave').disabled = false;


  //Añadimos la clase que esconde el select estado ya que todos los usuarios ingresados, tendrán el valor de activo y este se manda automaticamente
  document.getElementById('estado').classList.add('input-hide')
  document.getElementById('estado-label').classList.add('input-hide')

}


// Función para preparar el formulario al momento de modificar un registro.
function openUpdate(id) {
  //Limpiamos los campos del modal
  $("#save-modal").find("input,textarea,select").val("");
  // Se asigna el título para la caja de diálogo (modal).
  document.getElementById('modal-title').textContent = 'Actualizar empleado';
  //Desactivamos campos que no se podrán modificar
  document.getElementById('alias').disabled = true;
  document.getElementById('clave').disabled = true;
  document.getElementById('estado').classList.remove('input-hide')
  document.getElementById('estado-label').classList.remove('input-hide')
  // Se define un objeto con los datos del registro seleccionado.
  const data = new FormData();
  data.append('id', id);
  // Petición para obtener los datos del registro solicitado.
  fetch(API_CLIENTE + 'readOne', {
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
                  document.getElementById('id').value = response.dataset.idCliente;
                  document.getElementById('nombres').value = response.dataset.nombresCliente;
                  document.getElementById('apellidos').value = response.dataset.apellidosCliente;
                  document.getElementById('correo').value = response.dataset.correoCliente;
                  document.getElementById('telefono').value = response.dataset.telefonoCliente;
                  document.getElementById('direccion').value = response.dataset.direccionCliente;
                  document.getElementById('alias').value = response.dataset.aliasCliente;
                  document.getElementById('dui').value = response.dataset.duiCliente;
                  document.getElementById('nacimiento').value = response.dataset.nacimientoCliente;
                  fillSelect(ENDPOINT_ESTADO, 'estado', response.dataset.estadoCliente);
                  
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
}

// Función para preparar el formulario al momento de visualizar un registro.
function openShow(id) {
  // Se define un objeto con los datos del registro seleccionado.
  const data = new FormData();
  data.append('id', id);
  // Petición para obtener los datos del registro solicitado.
  fetch(API_CLIENTE + 'readOneShow', {
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
                  document.getElementById('show-nombres').innerText = response.dataset.nombresCliente;
                  document.getElementById('show-apellidos').innerText = response.dataset.apellidosCliente;
                  document.getElementById('show-dui').innerText = response.dataset.duiCliente;
                  document.getElementById('show-correo').innerText = response.dataset.correoCliente;
                  document.getElementById('show-telefono').innerText = response.dataset.telefonoCliente;
                  document.getElementById('show-nacimiento').innerText = response.dataset.nacimientoCliente;
                  document.getElementById('show-direccion').innerText = response.dataset.direccionCliente;
                  document.getElementById('show-estado').innerText = response.dataset.estadoCliente;
                  
              } else {
                  sweetAlert(2, response.exception, null);
              }
          });
      } else {
          console.log(request.status + ' ' + request.statusText);
      }
  });
}

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
  let content = '';
  // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
  dataset.map(function (row) {
      // Se crean y concatenan las filas de la tabla con los datos de cada registro.
      content += `
          <tr>
              <td>${row.nombresCliente}</td>
              <td>${row.apellidosCliente}</td>
              <td>${row.duiCliente}</td>
              <td>${row.correoCliente}</td>
              <td>${row.estadoCliente}</td>
              <td class="botones-table">
                  <div class="acciones d-flex mx-auto">
                      <span onclick="openUpdate(${row.idCliente})" class="accion-btn" type="button"
                          data-bs-toggle="modal" data-bs-target="#save-modal">
                          <i class="fa-solid fa-pen-to-square"></i>
                      </span>
                      <span onclick="openDelete(${row.idCliente})" class="accion-btn" type="button"
                          data-bs-toggle="modal" data-bs-target="#modal-eliminar">
                          <i class="fa-solid fa-trash-can fa-lg"></i>
                      </span>
                      <span onclick="openShow(${row.idCliente})" class="accion-btn" type="button"
                          data-bs-toggle="modal" data-bs-target="#modal-ver">
                          <i class="fa-solid fa-eye"></i>
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
  saveRow(API_CLIENTE, action, 'save-form', 'save-modal');
});

// Método manejador de eventos que se ejecuta cuando se envía el modal de eliminar.
document.getElementById('delete-form').addEventListener('submit', function (event) {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  //Llamamos al método que se encuentra en la api y le pasamos la ruta de la API y el id del formulario dentro de nuestro modal eliminar
  confirmDelete(API_CLIENTE, 'delete-form');
});
