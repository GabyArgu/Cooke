// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PRODUCTOS = SERVER + 'private/productos.php?action=';
const ENDPOINT_SUBCATEGORIA = SERVER + 'private/subcategoriapd.php?action=readAll';
const ENDPOINT_MARCA = SERVER + 'private/marca.php?action=readAll';
const ENDPOINT_PROVEEDOR = SERVER + 'private/proveedor.php?action=readAll';
//const ENDPOINT_ETIQUETA = SERVER + 'private/etiqueta.php?action=readAll';
const ENDPOINT_COLOR = SERVER + 'private/colores.php?action=readAll';
const ENDPOINT_ESTADO = SERVER + 'private/estado_producto.php?action=readAll';

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

// Función para preparar el modal al momento de insertar un registro.
function openCreate() {
    //Limpiamos los campos del modal
    document.getElementById('save-form').reset();

    // Se asigna el título para la caja de diálogo (modal).
    document.getElementById('modal-title').textContent = 'Agregar producto';
    document.getElementById('modal-title2').textContent = 'Agregar producto';

    //Añadimos la clase que esconde el select estado ya que todos los usuarios ingresados, tendrán el valor de activo y este se manda automaticamente
    document.getElementById('estado').classList.add('input-hide')
    document.getElementById('estado-label').classList.add('input-hide')

    //Activamos el stock
    document.getElementById('stock').disabled = false;
    document.getElementById('div-stock').classList.remove('col-lg-4');
    document.getElementById('div-stock').classList.add('col-12');
    document.getElementById('div-stock-nuevo').classList.add('input-hide')
    document.getElementById('añadir-stock').classList.add('input-hide')
    document.getElementById('quitar-stock').classList.add('input-hide')
    /* Se llama a la función que llena el select del formulario. Se encuentra en el archivo components.js, 
    * mandar de parametros la ruta de la api de la tabla que utiliza el select, y el id del select*/
    fillSelect(ENDPOINT_SUBCATEGORIA, 'subcategoria', null);
    fillSelect(ENDPOINT_MARCA, 'marca', null);
    fillSelect(ENDPOINT_PROVEEDOR, 'proveedor', null);
    fillSelect(ENDPOINT_COLOR, 'color', null);
}

// Función para preparar el formulario al momento de modificar un registro.
function openUpdate(id) {
    //Limpiamos los campos del modal
    document.getElementById('save-form').reset();
    // Se asigna el título para la caja de diálogo (modal).
    document.getElementById('modal-title').textContent = 'Actualizar producto';
    document.getElementById('modal-title2').textContent = 'Actualizar producto';
    //Mostramos label y select de estado
    document.getElementById('estado').classList.remove('input-hide')
    document.getElementById('estado-label').classList.remove('input-hide')
    // Se establece el campo de archivo como opcional.
    document.getElementById('archivo').required = false;
    //Desactivamos el stock al actualizar
    document.getElementById('stock').disabled = true;
    document.getElementById('div-stock').classList.add('col-lg-4');
    document.getElementById('div-stock').classList.remove('col-12');
    document.getElementById('div-stock-nuevo').classList.remove('input-hide')
    document.getElementById('añadir-stock').classList.remove('input-hide')
    document.getElementById('quitar-stock').classList.remove('input-hide')

    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PRODUCTOS + 'readOne', {
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
                    document.getElementById('id').value = response.dataset.idProducto;
                    document.getElementById('nombre').value = response.dataset.nombreProducto;
                    document.getElementById('precio').value = response.dataset.precioProducto;
                    document.getElementById('stock').value = response.dataset.stock;
                    document.getElementById('descuento').value = response.dataset.descuento;
                    document.getElementById('descripcion').value = response.dataset.descripcionProducto;
                    fillSelect(ENDPOINT_SUBCATEGORIA, 'subcategoria', response.dataset.idSubCategoriaP);
                    fillSelect(ENDPOINT_MARCA, 'marca', response.dataset.idMarca);
                    fillSelect(ENDPOINT_PROVEEDOR, 'proveedor', response.dataset.idProveedor);
                    fillSelect(ENDPOINT_COLOR, 'color', response.dataset.idColor);
                    fillSelect(ENDPOINT_ESTADO, 'estado', response.dataset.estadoProducto);


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

// Función para preparar el formulario al momento de visualizar un registro.
function openShow(id) {
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PRODUCTOS + 'readOneShow', {
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
                    document.getElementById('show-nombre').innerText = response.dataset.nombreProducto;
                    document.getElementById('show-marca').innerText = response.dataset.nombreMarca;
                    document.getElementById('show-precio').innerText = "$" + response.dataset.precioProducto;
                    document.getElementById('show-precio-before').innerText = "$" + String(parseFloat((response.dataset.precioProducto) * ((parseFloat(response.dataset.descuento)/100)+1.00)).toFixed(2));
                    document.getElementById('show-estado').innerText = response.dataset.estadoProducto;
                    document.getElementById('show-descripcion').innerText = response.dataset.descripcionProducto;
                    document.getElementById('show-stock').innerText = response.dataset.stock;
                    document.getElementById('show-color').innerText = response.dataset.colorProducto;
                    document.getElementById('show-subcategoria').innerText = response.dataset.nombreSubCategoriaP;
                    document.getElementById('show-fecha').innerText = response.dataset.fecha;
                    document.getElementById('show-img-main').src = `${SERVER}/images/productos/${response.dataset.imagenPrincipal}`;
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




// var input = document.querySelector('.tagify')
// var tagify = new Tagify(input, {
//   dropdown: {
//     enabled: 0
//   },
//   whitelist: ["Oferta", "Nuevo", "Abril", "Limitado", "Especial", "Descuento"]
// })
// input = document.querySelector('.tagify1')
// var tagify = new Tagify(input, {
//   dropdown: {
//     enabled: 0
//   },
//   whitelist: ["Oferta", "Nuevo", "Marzo", "Limitado", "Especial", "Descuento"]
// })

// Dropzone.options.myDropzone = {
//   // Configuration options go here
// };

function hoverImagen(ruta) {
    document.getElementById("main-img").src = ruta;
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
    saveRow(API_PRODUCTOS, action, 'save-form', 'save-modal-2');
});

let sumarStock = () => {
    let nuevo = parseInt(document.getElementById("stock-nuevo").value);
    let stock = parseInt(document.getElementById("stock").value);

    if (!isNaN(nuevo)) {
        let stockActualizado = stock + nuevo;
        document.getElementById("stock-nuevo").value = "";
        document.getElementById("stock").value = stockActualizado;
    }


}

let restarStock = () => {
    let nuevo = parseInt(document.getElementById("stock-nuevo").value);
    let stock = parseInt(document.getElementById("stock").value);

    if (!isNaN(nuevo)) {
        if ((stock - nuevo) < 0) {
            alert("No se puede tener stock en negativo")
            document.getElementById("stock-nuevo").value = "";
        }
        else {
            let stockActualizado = stock - nuevo;
            document.getElementById("stock-nuevo").value = "";
            document.getElementById("stock").value = stockActualizado;
        }
    }

}