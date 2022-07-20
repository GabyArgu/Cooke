function readReport(action) {
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PRODUCTOS + action, {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    let content = '';
                    response.dataset.map(function (row) {
                        // if(row.estado_producto == "En stock"){
                        //     estadoColor = 'estado';
                        // }
                        // else if(row.estado_producto == "Cantidad escasa"){
                        //     estadoColor = 'estado2';
                        // }
                        // else {
                        //     estadoColor = 'estado3';
                        // } 
                    
                    // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                    // Se coloca el nombre de la columna de la tabla---------------.
                    content += `
                        <tr>
                            <td data-title="PRODUCTO" class="col-table">
                                <div class="nombre-producto"><img
                                        src="${SERVER}images/productos/${row.imagen_producto}"
                                        alt="">${row.nombre_producto}
                                </div>
                            </td>
                            <td data-title="CATEGORIA" class="categoria">${row.nombre_subcategoria_p}</td>
                            <td data-title="PRECIO" class="precio">$${row.precio_producto}</td>
                            <td data-title="INVENTARIO" class="inventario">${row.stock}</td>
                            <td data-title="MARCA" class="marca">${row.nombre_marca}</td>
                            <td data-title="PROVEEDOR" class="proveedor">${row.nombre_proveedor}</td>
                            <td data-title="DESCRIPCION" class="descripcion">${row.descripcion_producto}</td>
                            <td data-title="ESTADO" class="estado-stock"><span id="estado-color" class="${estadoColor}">${row.estado_producto}</span></td>
                            <td data-title="Acciones" class="botones-table">
                                <div class="dropdown">
                                    <button class=" btn-acciones dropdown-toggle" type="button"
                                        id="dropdownMenuButton1" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        Acciones
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-end animate slideIn"
                                        aria-labelledby="dropdownMenuButton1">
                                        <li><a class="dropdown-item" onclick="openUpdate('${row.uuid_producto}')" type="button"  data-bs-toggle="modal"
                                                data-bs-target="#save-modal">Editar</a>
                                        </li>
                                        <li><a class="dropdown-item" onclick="openDelete('${row.uuid_producto}')" type="button"
                                                data-bs-toggle="modal"
                                                data-bs-target="#modal-eliminar">Eliminar</a>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                        </tr>            
                    `;
                    
                });
                document.getElementById('tbody_rows').innerHTML = content;
                } else {
                    sweetAlert(3, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

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

let content = "";

function generarPdf(){
    var pdf = new jsPDF('p', 'pt', 'letter');

}