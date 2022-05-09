// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_USUARIOS = SERVER + 'private/usuarios.php?action=';
const ENDPOINT_CARGO = SERVER + 'private/cargoEmpleado.php?action=readAll';
const ENDPOINT_ESTADO = SERVER + 'private/estadoEmpleado.php?action=readAll';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
  /* Cargando propiedades de datatable */
  $('#table-empleados').DataTable({
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
  readRows(API_USUARIOS);
  // Se define una variable para establecer las opciones del componente Modal.
  let options = {
    // dismissible: false,
    // onOpenStart: function () {
    //   // Se restauran los elementos del formulario.
    //   document.getElementById('save-form').reset();
    // }
  }
  var modal = new bootstrap.Modal(document.querySelector('.modal'), options)
});

// Función para preparar el formulario al momento de insertar un registro.
function openCreate() {
  // Se asigna el título para la caja de diálogo (modal).
  document.getElementById('modal-title').textContent = 'Agregar empleado';
  // Se habilitan los campos de alias y contraseña.
  document.getElementById('alias').disabled = false;
  document.getElementById('clave').disabled = false;
  
  // Se llama a la función que llena el select del formulario. Se encuentra en el archivo components.js, mandar de parametros la ruta de la api de la tabla que utiliza el select, y el id del select
  fillSelect(ENDPOINT_CARGO, 'cargo', null);
  fillSelect(ENDPOINT_ESTADO, 'estado', null);
}


// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
  let content = '';
  // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
  dataset.map(function (row) {
    // Se crean y concatenan las filas de la tabla con los datos de cada registro.
    content += `
          <tr>
              <td>${row.nombresEmpleado}</td>
              <td>${row.apellidosEmpleado}</td>
              <td>${row.telefonoEmpleado}</td>
              <td>${row.cargoEmpleado}</td>
              <td>${row.estadoEmpleado}</td>
              <td class="botones-table">
                  <div class="acciones d-flex mx-auto">
                      <span onclick="openUpdate(${row.idEmpleado})" class="accion-btn" type="button"
                          data-bs-toggle="modal" data-bs-target="#modal-actualizar">
                          <i class="fa-solid fa-pen-to-square"></i>
                      </span>
                      <span onclick="openDelete(${row.idEmpleado})" class="accion-btn" type="button"
                          data-bs-toggle="modal" data-bs-target="#modal-eliminar">
                          <i class="fa-solid fa-trash-can fa-lg"></i>
                      </span>
                      <span href="" class="accion-btn" type="button"
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

/*Inicializando y configurando componente de calendario*/ 
flatpickr('#fecha', {
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('save-form').addEventListener('submit', function (event) {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se define una variable para establecer la acción a realizar en la API.
  let action = '';
  // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
  (document.getElementById('id').value) ? action = 'update' : action = 'create';
  // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
  saveRow(API_USUARIOS, action, 'save-form', 'save-modal');
});
