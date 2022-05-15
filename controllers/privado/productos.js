// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PRODUCTOS = SERVER + 'private/productos.php?action=';
const ENDPOINT_CATEGORIA = SERVER + 'private/categoriapd.php?action=readAll';
const ENDPOINT_ESTADO = SERVER + 'private/estado_general.php?action=readAll';


// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
  /* Cargando propiedades de datatable */
  $('#table-productos').DataTable({
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
  readRows(API_PRODUCTOS);
});

//Función que se ejecuta cada vez que apretamos una tecla dentro del input #search, sirve para buscador en tiempo real
$(document).on('keyup', '#search', function () {
  var valor = $(this).val();
  if (valor != "") {
      //SearchRows se encuentra en componentes.js y mandamos la ruta de la api, el formulario el cual contiene nuestro input para buscar (id) y el input de buscar (id)
      searchRows(API_PRODUCTOS, 'search-form', 'search');
  }
  else {
      //Cuando el input este vacío porque borramos el texto manualmente
      readRows(API_PRODUCTOS);
  }
});




// Función para mandar el id de la row seleccionada al modal eliminar.
function openDelete(id) {
  document.getElementById('id-delete').value = id;
}

// Método manejador de eventos que se ejecuta cuando se envía el modal de eliminar.
document.getElementById('delete-form').addEventListener('submit', function (event) {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  //Llamamos al método que se encuentra en la api y le pasamos la ruta de la API y el id del formulario dentro de nuestro modal eliminar
  confirmDelete(API_PRODUCTOS, 'delete-form');
});

//Función para refrescar la tabla manualmente al darle click al botón refresh
document.getElementById('refresh').addEventListener('click', function () {
  readRows(API_PRODUCTOS);
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
              <td><img src="${SERVER}images/productos/${row.imagenPrincipal}" class="img-fluid" height="100"></td>
              <td>${row.nombreProducto}</td>
              <td>${row.descripcionProducto}</td>
              <td>${row.precioProducto}</td>
              <td>${row.estadoProducto}</td>
              <td class="botones-table">
                  <div class="acciones d-flex mx-auto">
                      <span onclick="openUpdate(${row.idProducto})" class="accion-btn" type="button"
                      data-bs-toggle="modal" data-bs-target="#save-modal">
                      <i class="fa-solid fa-pen-to-square"></i>
                      </span>
                      <span onclick="openDelete(${row.idProducto})" class="accion-btn" type="button"
                          data-bs-toggle="modal" data-bs-target="#modal-eliminar">
                          <i class="fa-solid fa-trash-can fa-lg"></i>
                      </span>
                      <span onclick="openShow(${row.idProducto})" class="accion-btn" type="button"
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




var input = document.querySelector('.tagify')
var tagify = new Tagify(input, {
  dropdown: {
    enabled: 0
  },
  whitelist: ["Oferta", "Nuevo", "Abril", "Limitado", "Especial", "Descuento"]
})
input = document.querySelector('.tagify1')
var tagify = new Tagify(input, {
  dropdown: {
    enabled: 0
  },
  whitelist: ["Oferta", "Nuevo", "Marzo", "Limitado", "Especial", "Descuento"]
})

Dropzone.options.myDropzone = {
  // Configuration options go here
};

function hoverImagen(ruta) {
  document.getElementById("main-img").src = ruta;
}
