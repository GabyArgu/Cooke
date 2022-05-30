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
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_CLIENTE);
});

// Función para preparar el formulario al momento de modificar un registro.
function openUpdate(id) {
    //Limpiamos los campos del modal
    document.getElementById('save-form').reset();
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
                    document.getElementById('nombres').value = response.dataset.nombresCliente;
                    document.getElementById('apellidos').value = response.dataset.apellidosCliente;
                    document.getElementById('correo').value = response.dataset.correoCliente;
                    document.getElementById('telefono').value = response.dataset.telefonoCliente;
                    document.getElementById('direccion').value = response.dataset.direccionCliente;
                    document.getElementById('alias').value = response.dataset.aliasCliente;
                    document.getElementById('dui').value = response.dataset.duiCliente;
                    document.getElementById('nacimiento').value = response.dataset.nacimientoCliente;
                   
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}
