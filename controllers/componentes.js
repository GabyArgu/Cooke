/*
 *   CONTROLADOR DE USO GENERAL EN TODAS LAS PÁGINAS WEB.
 */

/*
 *   Constante para establecer la ruta del servidor.
 */
const SERVER = "http://localhost/Cooke/api/";

/*
 *   Función para obtener todos los registros disponibles en los mantenimientos de tablas (operación read).
 *
 *   Parámetros: api (ruta del servidor para obtener los datos).
 *
 *   Retorno: ninguno.
 */

function readRows(api) {
    // Se promete devolver un valor (peticion al servidor)------------------------.
    fetch(api + "readAll", {
        method: "get",
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let data = [];
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    data = response.dataset;
                } else {
                    sweetAlert(4, response.exception, null);
                }
                // Se envían los datos a la función del controlador para llenar la tabla en la vista.
                fillTable(data);
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

function readRows2(api) {
    fetch(api + "readAll", {
        method: "get",
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let data = [];
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    data = response.dataset;
                } else {
                    sweetAlert(4, response.exception, null);
                }
                // Se envían los datos a la función del controlador para llenar la tabla en la vista.
                fillTable2(data);
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

function readRows3(api, id, table) {
    fetch(api + "readOneDPShow", {
        method: "post",
        body: id,
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se envían los datos a la función del controlador para que llene la tabla en la vista y se muestra un mensaje de éxito.
                    fillTable3(response.dataset, table);
                } else {
                    /* En caso de no encontrar coincidencias, limpiara el campo y se recargará la tabla -----------------------*/
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

function readRows4(api) {
    fetch(api + "readPedidosCliente", {
        method: "get",
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let data = [];
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    data = response.dataset;
                } else {
                    sweetAlert(2, response.exception, null);
                }
                // Se envían los datos a la función del controlador para llenar la tabla en la vista.
                fillTable4(data);
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

/*
 *   Función para obtener los resultados de una búsqueda en los mantenimientos de tablas (operación search).
 *
 *   Parámetros: api (ruta del servidor para obtener los datos) y form (identificador del formulario de búsqueda) y input (el id de nuestro input para buscar).
 *
 *   Retorno: ninguno.
 */
function searchRows(api, form, input) {
    fetch(api + "search", {
        method: "post",
        body: new FormData(document.getElementById(form)),
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se envían los datos a la función del controlador para que llene la tabla en la vista y se muestra un mensaje de éxito.
                    fillTable(response.dataset);
                    //sweetAlert(1, response.message, null);
                } else {
                    /* En caso de no encontrar coincidencias, limpiara el campo y se recargará la tabla */
                    sweetAlert(2, response.exception, null);
                    document.getElementById(input).value = "";
                    readRows(api);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

function searchRows2(api, form, input) {
    fetch(api + "search", {
        method: "post",
        body: new FormData(document.getElementById(form)),
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se envían los datos a la función del controlador para que llene la tabla en la vista y se muestra un mensaje de éxito.
                    fillTable2(response.dataset);
                    //sweetAlert(1, response.message, null);
                } else {
                    /* En caso de no encontrar coincidencias, limpiara el campo y se recargará la tabla */
                    sweetAlert(2, response.exception, null);
                    document.getElementById(input).value = "";
                    readRows2(api);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

/*
 *   Función para crear o actualizar un registro en los mantenimientos de tablas (operación create y update).
 *
 *   Parámetros: api (ruta del servidor para enviar los datos), form (identificador del formulario) y modal (identificador de la caja de dialogo).
 *
 *   Retorno: ninguno.
 */
function saveRow(api, action, form, modal) {
    fetch(api + action, {
        method: "post",
        body: new FormData(document.getElementById(form)),
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se cierra la caja de dialogo (modal) del formulario.
                    bootstrap.Modal.getInstance(document.getElementById(modal)).hide();

                    //M.Modal.getInstance(document.getElementById(modal)).close();
                    // Se cargan nuevamente las filas en la tabla de la vista después de guardar un registro y se muestra un mensaje de éxito.
                    readRows(api);
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

function saveRow2(api, action, form, modal) {
    fetch(api + action, {
        method: "post",
        body: new FormData(document.getElementById(form)),
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se cierra la caja de dialogo (modal) del formulario.
                    // $(modal).modal('hide');

                    //M.Modal.getInstance(document.getElementById(modal)).close();
                    // Se cargan nuevamente las filas en la tabla de la vista después de guardar un registro y se muestra un mensaje de éxito.
                    readRows2(api);
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

function saveRow3(api, action, form, modal) {
    fetch(api + action, {
        method: "post",
        body: new FormData(document.getElementById(form)),
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    $(`#${modal}`).modal("hide");
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

/*
 *   Función para eliminar un registro seleccionado en los mantenimientos de tablas (operación delete). Requiere el archivo sweetalert.min.js para funcionar.
 *
 *   Parámetros: api (ruta del servidor para enviar los datos) y form (objeto con los datos del registro a eliminar).
 *
 *   Retorno: ninguno.
 */
function confirmDelete(api, form) {
    fetch(api + "delete", {
        method: "post",
        body: new FormData(document.getElementById(form)),
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se cargan nuevamente las filas en la tabla de la vista después de borrar un registro y se muestra un mensaje de éxito.
                    readRows(api);
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

function confirmDelete2(api, form) {
    fetch(api + "delete", {
        method: "post",
        body: new FormData(document.getElementById(form)),
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se cargan nuevamente las filas en la tabla de la vista después de borrar un registro y se muestra un mensaje de éxito.
                    readRows2(api);
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}
/*
 *   Función para manejar los mensajes de notificación al usuario. Requiere el archivo sweetalert.min.js para funcionar.
 *
 *   Parámetros: type (tipo de mensaje), text (texto a mostrar) y url (ubicación para enviar al cerrar el mensaje).
 *
 *   Retorno: ninguno.
 */
function sweetAlert(type, text, url) {
    // Se compara el tipo de mensaje a mostrar.
    switch (type) {
        case 1:
            title = "Éxito";
            icon = "success";
            break;
        case 2:
            title = "Error";
            icon = "error";
            break;
        case 3:
            title = "Advertencia";
            icon = "warning";
            break;
        case 4:
            title = "Aviso";
            icon = "info";
    }
    // Si existe una ruta definida, se muestra el mensaje y se direcciona a dicha ubicación, de lo contrario solo se muestra el mensaje.
    if (url) {
        swal({
            title: title,
            text: text,
            icon: icon,
            button: "Aceptar",
            closeOnClickOutside: false,
            closeOnEsc: false,
        }).then(function () {
            location.href = url;
        });
    } else {
        swal({
            title: title,
            text: text,
            icon: icon,
            button: "Aceptar",
            closeOnClickOutside: false,
            closeOnEsc: false,
        });
    }
}

/*
 *   Función para cargar las opciones en un select de formulario.
 *
 *   Parámetros: endpoint (ruta específica del servidor para obtener los datos), select (identificador del select en el formulario) y selected (valor seleccionado).
 *
 *   Retorno: ninguno.
 */
function fillSelect(endpoint, select, selected) {
    fetch(endpoint, {
        method: "get",
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let content = "";
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Si no existe un valor para seleccionar, se muestra una opción para indicarlo.
                    if (!selected) {
                        content +=
                            "<option disabled selected>Seleccione una opción</option>";
                    }
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se obtiene el dato del primer campo de la sentencia SQL (valor para cada opción).
                        value = Object.values(row)[0];
                        // Se obtiene el dato del segundo campo de la sentencia SQL (texto para cada opción).
                        text = Object.values(row)[1];
                        // Se verifica si el valor de la API es diferente al valor seleccionado para enlistar una opción, de lo contrario se establece la opción como seleccionada.
                        if (value != selected) {
                            content += `<option value="${value}">${text}</option>`;
                        } else {
                            content += `<option value="${value}" selected>${text}</option>`;
                        }
                    });
                } else {
                    content += "<option>No hay opciones disponibles</option>";
                }
                // Se agregan las opciones a la etiqueta select mediante su id.
                document.getElementById(select).innerHTML = content;
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

/*
 *   Función para cargar las opciones en un select de formulario de un producto en especifico.
 *
 *   Parámetros: endpoint (ruta específica del servidor para obtener los datos), select (identificador del select en el formulario) y selected (valor seleccionado), id del producto.
 *
 *   Retorno: ninguno.
 *   Se usa para cargar los colores que hay guardados de cierto producto
 */
function fillSelectProducto(endpoint, select, selected, id) {
    //let valorReturn;
    // Se define un objeto con los datos del producto seleccionado.
    const data = new FormData();
    data.append("idProducto", id);
    fetch(endpoint, {
        method: "post",
        body: data,
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let content = "";
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Si no existe un valor para seleccionar, se muestra una opción para indicarlo.
                    if (!selected) {
                        content +=
                            "<option disabled selected>Seleccione una opción</option>";
                    }
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se obtiene el dato del primer campo de la sentencia SQL (valor para cada opción).
                        value = Object.values(row)[0];
                        // Se obtiene el dato del segundo campo de la sentencia SQL (texto para cada opción).
                        text = Object.values(row)[1];
                        // Se verifica si el valor de la API es diferente al valor seleccionado para enlistar una opción, de lo contrario se establece la opción como seleccionada.
                        if (value != selected) {
                            content += `<option value="${value}">${text}</option>`;
                        } else {
                            content += `<option value="${value}" selected>${text}</option>`;
                            //valorReturn = value;
                        }
                    });
                } else {
                    content += "<option>No hay opciones disponibles</option>";
                }
                // Se agregan las opciones a la etiqueta select mediante su id.
                document.getElementById(select).innerHTML = content;
                //return valorReturn;
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

//Validacion para que no acepte numeros
$("input.nombre").bind("keypress", function (event) {
    var regex = new RegExp(
        "/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;"
    );
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});

// Función para mostrar un mensaje de confirmación al momento de cerrar sesión.
function logOut() {
    swal({
        title: "Advertencia",
        text: "¿Está seguro de cerrar la sesión?",
        icon: "warning",
        buttons: ["No", "Sí"],
        closeOnClickOutside: false,
        closeOnEsc: false,
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para hacer la petición de cerrar sesión, de lo contrario se muestra un mensaje.
        if (value) {
            fetch(API + "logOut", {
                method: "get",
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    // Se obtiene la respuesta en formato JSON.
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            sweetAlert(1, response.message, "index.html");
                        } else {
                            sweetAlert(2, response.exception, null);
                        }
                    });
                } else {
                    console.log(request.status + " " + request.statusText);
                }
            });
        } else {
            sweetAlert(4, "Puede continuar con la sesión", null);
        }
    });
}

/*
 *   Función para generar un gráfico de lineas.
 *
 *   Parámetros: canvas (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), y legend (etiqueta para los datos).
 *
 *   Retorno: ninguno.
 */
function lineGraph(canvas, xAxis, yAxis, legend) {
    // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
    const context = document.getElementById(canvas).getContext("2d");
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    const chart = new Chart(context, {
        type: "line",
        data: {
            labels: xAxis,
            datasets: [
                {
                    label: legend,
                    data: yAxis,
                    fill: true,
                    borderColor: "#CF71A3",
                    backgroundColor: "#CF71A3",
                    pointBackgroundColor: "#C34E8B",
                    tension: 0.3,
                    pointRadius: 2,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                },
            },
        },
    });
}

/*
 *   Función para generar un gráfico de lineas.
 *
 *   Parámetros: canvas (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), y legend (etiqueta para los datos).
 *
 *   Retorno: ninguno.
 */
function lineGraph2(canvas, xAxis, yAxis, legend) {
    // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
    const context = document.getElementById(canvas).getContext("2d");
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    const chart = new Chart(context, {
        type: "line",
        data: {
            labels: xAxis,
            datasets: [
                {
                    label: legend,
                    data: yAxis,
                    fill: true,
                    borderColor: "#CF71A3",
                    backgroundColor: "#CF71A3",
                    pointBackgroundColor: "#C34E8B",
                    tension: 0.3,
                    pointRadius: 2,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                },
            },
        },
    });
}

/*
 *   Función para generar un gráfico de lineas.
 *
 *   Parámetros: canvas (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), y legend (etiqueta para los datos).
 *
 *   Retorno: ninguno.
 */
function multiLineGraph(canvas, xAxis, yAxis1, yAxis2, yAxis3, yAxis4, legend1, legend2, legend3, legend4) {
    // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
    const context = document.getElementById(canvas);
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    const chart = new Chart(context, {
        type: "line",
        data: {
            labels: xAxis,
            datasets: [
                {
                    label: legend1,
                    data: yAxis1,
                    backgroundColor: 'transparent',
                    borderColor: "#E6006D",
                    borderWidth: 4,
                    pointBackgroundColor: "#E6006D",
                    lineTension: 0.5
                },
                {
                    label: legend2,
                    data: yAxis2,
                    backgroundColor: "transparent",
                    borderColor: "#F794A6",
                    borderWidth: 4,
                    pointBackgroundColor: "#F794A6",
                    lineTension: 0.5,
                },
                {
                    label: legend3,
                    data: yAxis3,
                    backgroundColor: 'transparent',
                    borderColor: "#F764B2",
                    borderWidth: 4,
                    pointBackgroundColor: "#F764B2",
                    lineTension: 0.5
                },
                {
                    label: legend4,
                    data: yAxis4,
                    backgroundColor: 'transparent',
                    borderColor: "#FFCFD3",
                    borderWidth: 4,
                    pointBackgroundColor: "#FFCFD3",
                    lineTension: 0.5
                },
            ],
        },
        options: {
            
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: "#C44E8C",
                    },
                },
            },
        },
    });
}

/*
*   Función para generar un gráfico de pastel.
*
*   Parámetros: canvas (identificador de la etiqueta canvas), legends (valores para las etiquetas), values (valores de los datos) y title (título del gráfico).
*
*   Retorno: ninguno.
*/
function pieGraph(canvas, legends, values, title) {
    // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
    let colors = ["#c34e8b", "#75365a", "#d97789", "#f7dadf"];
    // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
    const context = document.getElementById(canvas).getContext('2d');
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    const chart = new Chart(context, {
        type: 'pie',
        data: {
            labels: legends,
            datasets: [{
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            plugins: {
                title: {
                    display: false,
                    text: title
                }
            }
        }
    });
}

function barGraph(canvas, xAxis, yAxis, legend, title) {
    // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
    let colors = [];
    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
    for (i = 0; i < xAxis.length; i++) {
        if (colors[i-1] == '#75365A' || i == 0) {
            colors.push('#C44E8C');
        }
        else{
            colors.push('#75365A');
        }
        
    }
    // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
    const context = document.getElementById(canvas).getContext('2d');
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    const chart = new Chart(context, {
        type: 'bar',
        data: {
            labels: xAxis,
            datasets: [{
                label: legend,
                data: yAxis,
                borderColor: '#C44E8C',
                borderWidth: 1,
                backgroundColor: colors,
                barPercentage: 1
            }]
            
        },
        options: {
            aspectRatio: 1,
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    ticks: {
                        beginAtZero: true,
                        stepSize: 0
                    }
                }
            }
        }
    });
}