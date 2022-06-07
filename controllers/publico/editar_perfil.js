// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_CLIENTE = SERVER + 'public/cliente.php?action=';
const ENDPOINT_AVATAR = SERVER + 'public/cliente.php?action=readAvatar';

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
    cargarCliente();
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
    saveRow3(API_CLIENTE, action, 'save-form', 'save-modal');
    cargarCliente();
});

//Función para cambiar y mostrar el avatar dinámicamente en modals-------------------.
function changeAvatar() {
    let combo = document.getElementById('foto')
    let selected = combo.options[combo.selectedIndex].text;
    document.getElementById('imagen-avatar').style.display = 'inline-block'
    document.getElementById('imagen-avatar').src = `../../resources/img/avatares/${selected}.jpg`;
}
// Función para obtener el detalle del pedido (carrito de compras).
function cargarCliente() {
    // Petición para solicitar los datos del pedido en proceso.
    fetch(API_CLIENTE + 'readOneShow', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se inicializan los campos del formulario con los datos del registro seleccionado.
                    document.getElementById('nombres-cliente').innerText = response.dataset.nombresCliente;
                    document.getElementById('apellidos-cliente').innerText = response.dataset.apellidosCliente;
                    document.getElementById('correo-cliente').innerText = response.dataset.correoCliente;
                    document.getElementById('telefono-cliente').innerText = response.dataset.telefonoCliente;
                    document.getElementById('direccion-cliente').innerText = response.dataset.direccionCliente;
                    document.getElementById('alias-cliente').innerText = response.dataset.aliasCliente;
                    document.getElementById('dui-cliente').innerText = response.dataset.duiCliente;
                    document.getElementById('nacimiento-cliente').innerText = response.dataset.nacimientoCliente;
                    document.getElementById('avatar-cliente').src = `../../resources/img/avatares/${response.dataset.avatar}.jpg`
                    document.getElementById('avatar-cliente').style.display = 'inline-block'
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}