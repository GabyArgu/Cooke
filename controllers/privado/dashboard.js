// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PRODUCTOS = SERVER + 'private/productos.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llaman a la funciones que generan los gráficos en la página web.
    graficoLineasVentasSemanales();
});

/*Graficos*/
/*Ingresos totales por dia en la semana*/
// Función para mostrar la cantidad de productos por categoría en un gráfico de barras.
function graficoLineasVentasSemanales() {
    // Petición para obtener los datos del gráfico.
    fetch(API_PRODUCTOS + 'ventasPorSemana', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.status) {
                    // Se declaran los arreglos para guardar los datos a graficar.
                    let dias = [];
                    let cantidades = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos.
                        dias.push(row.Fecha);
                        cantidades.push(row.total);
                    });
                    // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                    lineGraph('vsemana', dias, cantidades, 'Ventas semanales');
                } else {
                    document.getElementById('vsemana').remove();
                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });

    //Petición para obtener la estadistica de ventas totales por semana
    fetch(API_PRODUCTOS + 'ventasPorSemanaEstadistica', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    //Le asignamos el valor a la etiqueta del monto
                    document.getElementById('e-semana').innerText = `$${parseFloat(response.dataset.total).toFixed(2)}`;
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    sweetAlert(4, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}