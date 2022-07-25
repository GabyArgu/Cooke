// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PRODUCTOS = SERVER + "private/productos.php?action=";
let multi = {};
// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener("DOMContentLoaded", function () {
    // Se llaman a la funciones que generan los gráficos en la página web.
    graficoLineasVentasSemanales();
    graficoMultiVentasCategoria();
    graficoPastelMarcas();
    graficoLineasVentasProductos();
    graficoBarrasCategoriaStock();
});

function getWeek() {
    let today = new Date();
    let fechas = [];
    for (let i = 0; i < 7; i++) {
        fechas.push(today.getDate() - i);
    }
    return fechas.reverse();
}

/*Graficos*/
/*Ingresos totales por dia en la semana*/
function graficoLineasVentasSemanales() {
    // Petición para obtener los datos del gráfico.
    fetch(API_PRODUCTOS + "ventasPorSemana", {
        method: "get",
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.status) {
                    // Se declaran los arreglos para guardar los datos a graficar.
                    let dias = getWeek();
                    let cantidades = [];
                    //Iteramos por cada elemento del array que contiene la semana pasada
                    dias.forEach((dia) => {
                        //buscamos elemento que coincida con el día para validar existencia de este en el dataset, en caso de no existir retorna undefined
                        const registro = response.dataset.find((row) => row.Fecha == dia);
                        let total = 0;
                        if (registro != undefined) {
                            total = registro.total;
                        }
                        //const total = registro ? registro.total : 0;
                        cantidades.push(total);
                    });
                    // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                    lineGraph("vsemana", dias, cantidades, "Ventas semanales (USD)");
                } else {
                    document.getElementById("vsemana").remove();
                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });

    //Petición para obtener la estadistica de ventas totales por semana
    fetch(API_PRODUCTOS + "ventasPorSemanaEstadistica", {
        method: "get",
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    //Le asignamos el valor a la etiqueta del monto
                    if (isNaN(parseFloat(response.dataset.total))) {
                        document.getElementById("e-semana").innerText =
                            "Todavía no hay ventas esta semana";
                    } else {
                        document.getElementById("e-semana").innerText = `$${parseFloat(
                            response.dataset.total
                        ).toFixed(2)} en ingresos semanales`;
                    }
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    sweetAlert(4, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

// Función para mostrar la cantidad de productos por categoría en un gráfico de barras.
function graficoLineasVentasProductos() {
    // Petición para obtener los datos del gráfico.
    fetch(API_PRODUCTOS + "productosPorSemana", {
        method: "get",
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.status) {
                    // Se declaran los arreglos para guardar los datos a graficar.
                    let dias = getWeek();
                    let cantidades = [];
                    //Iteramos por cada elemento del array que contiene la semana pasada
                    dias.forEach((dia) => {
                        
                        //buscamos elemento que coincida con el día para validar existencia de este en el dataset, en caso de no existir retorna undefined
                        const registro = response.dataset.find((row) => row.Fecha == dia);
                        let total = 0;
                        if (registro != undefined) {
                            //Cantidad es el nombre de la columna que cuenta los registros en la consulta
                            total = registro.Cantidad;
                        }
                        console.log(total);
                        //const total = registro ? registro.total : 0;
                        cantidades.push(total);
                    });
                    // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                    lineGraph2("vprodu", dias, cantidades, "Productos vendidos");
                } else {
                    document.getElementById("vprodu").remove();
                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });

    //Petición para obtener la estadistica de ventas totales por semana
    fetch(API_PRODUCTOS + "productosPorSemanaEstadistica", {
        method: "get",
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    //Le asignamos el valor a la etiqueta del monto
                    if (isNaN(parseFloat(response.dataset.Cantidad))) {
                        document.getElementById("e-produ").innerText =
                            "No hay productos vendidos esta semana";
                    } else {
                        document.getElementById("e-produ").innerText = `${parseFloat(
                            response.dataset.Cantidad
                        ).toFixed()} vendidos durante la semana`;
                    }
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    sweetAlert(4, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}
function graficoMultiVentasCategoria() {
    let multi = {};
    Promise.all([
        fetch(API_PRODUCTOS + "ventasEnSemanaCategoria1"),
        fetch(API_PRODUCTOS + "ventasEnSemanaCategoria2"),
        fetch(API_PRODUCTOS + "ventasEnSemanaCategoria3"),
        fetch(API_PRODUCTOS + "ventasEnSemanaCategoria4"),
    ])
        .then(function (responses) {
            return Promise.all(
                responses.map(function (response) {
                    return response.json();
                })
            );
        })
        .then(function (data) {
            let dias = getWeek();
            //Recorremos cada fila del data
            data.forEach((col, index) =>{
                //Vaciamos la variable cantidades para llenarla por cada dataset
                let cantidades = [];
                //Iteramos por cada elemento del array que contiene la semana pasada
                dias.forEach((dia) => {
                    //Buscamos elemento que coincida con el día para validar existencia de este en el dataset, en caso de no existir retorna undefined
                    const registro = data[index].dataset.find((row) => row.Fecha == dia);
                    let total = 0;
                    if (registro != undefined) {
                        total = registro.total;
                    }
                    //const total = registro ? registro.total : 0;
                    cantidades.push(total);
                });
                //Guardamos el array obtenido en el objeto.
                multi['datos'+(index+1)] = cantidades;
            });
            //Guardamos todos los legend/label a utilizar (nombre de datos asociados a cada array de datos)
            multi.categoria1Legend = "Cocina (USD)";
            multi.categoria2Legend = "Utensilios (USD)";
            multi.categoria3Legend = "Electrodomésticos (USD)";
            multi.categoria4Legend = "Recetas (USD)";
            console.log(multi);
        }).then(()=>{
            //Una vez se realiza todo lo anterior, se llama la función para generar el gráfico y pasarle los datos.
            multiLineGraph('chart-ventas-categoria', getWeek(), multi.datos1, multi.datos2, multi.datos3, multi.datos4, multi.categoria1Legend, multi.categoria2Legend, multi.categoria3Legend, multi.categoria4Legend);
            
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Función para mostrar el porcentaje de productos por categoría en un gráfico de pastel.
function graficoPastelMarcas() {
    // Petición para obtener los datos del gráfico.
    fetch(API_PRODUCTOS + 'productosPorMarca', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.status) {
                    // Se declaran los arreglos para guardar los datos a gráficar.
                    let marcas = [];
                    let cantidad = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos.
                        marcas.push(row.nombreMarca);
                        cantidad.push(row.cantidad);
                    });
                    // Se llama a la función que genera y muestra un gráfico de pastel. Se encuentra en el archivo components.js
                    pieGraph('chart-productos-marca', marcas, cantidad, 'Cantidad de productos por marca');
                } else {
                    document.getElementById('chart-productos-marca').remove();
                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

function graficoBarrasCategoriaStock() {
    // Petición para obtener los datos del gráfico.
    fetch(API_PRODUCTOS + 'productoStockCategoria', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.status) {
                    // Se declaran los arreglos para guardar los datos a graficar.
                    let categorias = [];
                    let cantidades = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos.
                        categorias.push(row.nombreCategoriaP);
                        cantidades.push(row.count);
                    });
                    // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                    barGraph('producto-Stock-Categoria', categorias, cantidades, 'Cantidad de productos', 'Productos en Stock por Categoria');
                } else {
                    document.getElementById('producto-Stock-Categoria').remove();
                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}
