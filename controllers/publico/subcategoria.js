// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_CATALOGO = SERVER + 'public/catalogo.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se busca en la URL las variables (parámetros) disponibles.
    let params = new URLSearchParams(location.search);
    // Se obtienen los datos localizados por medio de las variables.
    const ID = params.get('id');
    const NAME = params.get('nombre');
    // Se llama a la función que muestra los productos de la categoría seleccionada previamente.
    readSubcategoriaCategoria(ID, NAME);
});

// Función para obtener y mostrar los productos de acuerdo a la categoría seleccionada.
function readSubcategoriaCategoria(id, categoria) {
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('idCategoria', id);
    // Petición para solicitar los productos de la categoría seleccionada.
    fetch(API_CATALOGO + 'readSubcategoriasCategoria', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se define una dirección con los datos de cada categoría para mostrar sus productos en otra página web.
                    let url = '';
                    let content = '';
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se define una dirección con los datos de cada categoría para mostrar sus productos en otra página web.
                        url = `gridproductos.html?id=${row.idSubCategoriaP}&nombre=${row.nombreSubCategoriaP}`;
                        // Se crean y concatenan las tarjetas con los datos de cada producto.
                        content += `
                            <div class="col-4 categoria-item">
                                <div class="categoria-img-content">
                                    <div class="categoria-img">

                                        <img src="${SERVER}images/subcategoriaspd/${row.imagenSubcategoria}" alt=""
                                            class="img-fluid d-block mx-auto">
                                        <button type="button" class="col-6 text-center"><a href="gridproductos.html">Ver
                                                categoría</a>
                                        </button>
                                    </div>

                                    <div class="categoria-info p-2">
                                        <span href="" class="categoria-name d-block "><a
                                                href="gridproductos.html">${row.nombreSubCategoriaP}</a></span>
                                        <span href="#" class="categoria-description d-block mt-1">${row.descripcionSubCategoriaP}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    // Se asigna como título la categoría de los productos.
                    document.getElementById('title').textContent =  categoria;
                    // Se agregan las tarjetas a la etiqueta div mediante su id para mostrar los productos.
                    document.getElementById('subcategorias').innerHTML = content;
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    document.getElementById('title').innerHTML = `${response.exception}:`;
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}