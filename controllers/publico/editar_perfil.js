// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_CLIENTE = SERVER + 'private/cliente.php?action=';
const ENDPOINT_AVATAR = SERVER + 'private/avatar.php?action=readAll';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se declara e inicializa un objeto para obtener la fecha y hora actual.
    let today = new Date();
    // Se declara e inicializa una variable para guardar el día en formato de 2 dígitos.
    let day = ('0' + today.getDate()).slice(-2);
    // Se declara e inicializa una variable para guardar el mes en formato de 2 dígitos.
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    // Se declara e inicializa una variable para guardar el año con la mayoría de edad.
    let year = today.getFullYear() - 18;
    // Se declara e inicializa una variable para establecer el formato de la fecha.
    let date = `${year}-${month}-${day}`;

    /*Inicializando y configurando componente de calendario*/
    $('#nacimiento').flatpickr({
        maxDate: date
    })

});

// Función para preparar el formulario al momento de modificar un registro.
function openUpdate() {
    //Limpiamos los campos del modal
    document.getElementById('save-form').reset();
    // Se define un objeto con los datos del registro seleccionado.

    // Petición para obtener los datos del registro solicitado.
    fetch(API_CLIENTE + 'readOne', {
        method: 'post',
        body: new FormData(document.getElementById('save-form'))
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
                    fillSelect(ENDPOINT_AVATAR, 'foto', response.dataset.avatar);
                    document.getElementById('imagen-avatar').src = `../../resources/img/avatares/avatar${response.dataset.avatar}.jpg`
                    document.getElementById('imagen-avatar').style.display = 'inline-block'
                   
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
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    action = 'update'
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_CLIENTE, action, 'save-form', 'save-modal');
});

//Función para cambiar y mostrar el avatar dinámicamente en modals-------------------.
function changeAvatar() {
    let combo = document.getElementById('foto')
    let selected = combo.options[combo.selectedIndex].text;
    document.getElementById('imagen-avatar').style.display = 'inline-block'
    document.getElementById('imagen-avatar').src = `../../resources/img/avatares/${selected}.jpg`;
}
// Función para obtener el detalle del pedido (carrito de compras).
function openShow() {
    // Petición para solicitar los datos del pedido en proceso.
    fetch(API_CLIENTE  + 'readOneShow', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se declara e inicializa una variable para concatenar las filas de la tabla en la vista.
                    let content = '';
                    // Se declara e inicializa una variable para calcular el importe por cada producto.
                    let subtotal = 0;
                    // Se declara e inicializa una variable para ir sumando cada subtotal y obtener el monto final a pagar.
                    let total = 0;
                    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        subtotal = row.precioUnitario * row.cantidadProducto;
                        total += subtotal;
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content = `
                        <div class="tab-pane fade" id="v-pills-profile" role="tabpanel"
                        aria-labelledby="v-pills-profile-tab">
                        <div class="container-fluid justify-content-center align-items-center" id="Cuenta-table">
                            <div class="row">
                                <div class="col-sm-12 col-md-6 col-lg-4 usu-img">
                                    <img src="../../resources/img/usuario/usuario.png" alt="">
                                </div>
                                <div
                                    class="col-sm-12 col-md-6 col-lg-8 mt-4 usu-d d-flex align-items-start justify-content-center flex-column">
                                    <h5><b>${row.telefonoCliente}</b></h5>
                                    <h5 class="mt-4"> <b>${row.correoCliente}</b> </h5>
                                    <h5 class="mt-4"> <b>${row.direccionCliente}</b> 
                                    </h5>
                                </div>
                            </div>
                            <div class="row mt-4">
                                <div class="col-sm-12 col-md-6 col-lg-4">
                                    <h5> <b>${row.aliasCliente}</b></h5>
                                </div>
                                <div class="col-sm-12 col-md-6 col-lg-4">
                                    <h5> <b>${row.nombreCliente}</b></h5>
                                </div>
                                <div class="col-sm-12 col-md-6 col-lg-4">
                                    <h5> <b>${row.apellidoCliente}</b></h5>
                                </div>
                            </div>
                            <div class="row mt-4">
                                <div class="col-sm-12 col-md-6 col-lg-4">
                                    <h5> <b>${row.nacimientoCliente}</b></h5>
                                </div>
                                <div class="col-sm-12 col-md-6 col-lg-4">
                                    <h5> <b>${row.duiCliente}</b></h5>
                                </div>
                                <div class="col-sm-12 col-md-6 col-lg-4 mt-0">
                                    <a onclick="openUpdate()" class="a-edi" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                                        href="#staticBackdrop"><img src="../../resources/img/usuario/editar.png"
                                            alt="">
                                        Editar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('tbody-rows').innerHTML = content;
                    // Se muestra el total a pagar con dos decimales.
                   
                } else {
                    sweetAlert(4, response.exception, 'index.html');
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}