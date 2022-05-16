// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_MARCA = SERVER + 'private/marca.php?action=';
const API_PROVEEDORES = SERVER + 'private/proveedor.php?action=';
const ENDPOINT_ESTADO = SERVER + 'private/estado_general.php?action=readAll';


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

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
  let content = '';
  // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
  dataset.map(function (row) {
      // Se crean y concatenan las filas de la tabla con los datos de cada registro.
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

function openCreate2() {

  //Limpiamos los campos del modal
  $("#save-modal2").find("input,textarea,select").val("");

  // Se asigna el título para la caja de diálogo (modal).
  document.getElementById('modal-title2').textContent = 'Agregar proveedor';

  //Añadimos la clase que esconde el select estado ya que todos los usuarios ingresados, tendrán el valor de activo y este se manda automaticamente
  document.getElementById('estado2').classList.add('input-hide')
  document.getElementById('estado-label2').classList.add('input-hide')


  /* Se llama a la función que llena el select del formulario. Se encuentra en el archivo components.js, 
   * mandar de parametros la ruta de la api de la tabla que utiliza el select, y el id del select*/
  fillSelect(ENDPOINT_CARGO, 'cargo', null);
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
                  <span onclick="openUpdate(${row.idProveedor})" class="accion-btn" type="button"
                      data-bs-toggle="modal" data-bs-target="#save-modal">
                      <i class="fa-solid fa-pen-to-square"></i>
                  </span>
                  <span onclick="openDelete(${row.idProveedor})" class="accion-btn" type="button"
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


/*
* Pendiente:
* Crud clientes Insert con imagen, update con cargar los campos, y que se actualice el registro en la base, delete(es un update al estado nada más) 
*
* 
*/