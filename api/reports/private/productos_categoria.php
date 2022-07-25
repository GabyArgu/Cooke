<?php
require('../../helpers/dashboard_report.php');
require('../../models/productos.php');
require('../../models/categorias_productos.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Productos por categoría');

//Dibujando línea
$pdf->SetLineWidth(15);// Define el ancho de línea -->
$pdf->SetDrawColor(195, 78, 139); //Define el color utilizado para todas las operaciones de dibujo (líneas, rectángulos y bordes de celda)-->
$pdf->Line(0, 0, 215, 0); //Dibuja una línea-->

$pdf->SetLineWidth(0.2);
$pdf->SetDrawColor(247, 218, 223);
$pdf->SetTextColor(117, 54, 90); //Define el color del texto-->
//Saltos de línea
$pdf->ln(10); //Realiza un salto de línea-->

// Se instancia el módelo Categorías para obtener los datos.
$categoria = new CategoriaCP;
// Se verifica si existen registros (categorías) para mostrar, de lo contrario se imprime un mensaje.
if ($dataCategoria = $categoria->readAll()) {
    $pdf->SetTextColor(117, 54, 90);
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(247, 218, 223);//Define el color utilizado para todas las operaciones de relleno (rectángulos rellenos y fondos de celda)-->
    // Se establece la fuente para los encabezados.
    $pdf->addFont('Mohave-Bold','','Mohave-Bold.php');//Importa una fuente y la pone a disposición-->
    $pdf->addFont('Mohave-Light','','Mohave-Light.php');
    $pdf->setFont('Mohave-Bold','',14);//Establece la fuente utilizada para imprimir cadenas de caracteres-->
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(58, 10, utf8_decode('Nombre'), 0, 0, 'C', 1);//Imprime una celda (área rectangular) con bordes opcionales, color de fondo y cadena de caracteres-->
    $pdf->cell(31, 10, utf8_decode('Subcategoria'), 0, 0, 'C', 1);
    $pdf->cell(46, 10, utf8_decode('Marca'), 0, 0, 'C', 1);
    $pdf->cell(31, 10, utf8_decode('Proveedor'), 0, 0, 'C', 1);
    $pdf->cell(20, 10, utf8_decode('Precio'), 0, 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(252, 242, 244);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Mohave-Light','', 12);

    // Se recorren los registros ($dataCategorias) fila por fila ($rowCategoria).
    foreach ($dataCategoria as $rowCategoria) {
        // Se imprime una celda con el nombre de la categoría.
        $pdf->cell(0, 10, utf8_decode('Categoría: '.$rowCategoria['nombreCategoriaP']), 0, 1, 'C', 1);
        // Se instancia el módelo Productos para procesar los datos.
        $productos = new Productos;
        // Se establece la categoría para obtener sus productos, de lo contrario se imprime un mensaje de error.
        if ($categoria->setId($rowCategoria['idCategoria'])) {
            // Se verifica si existen registros (productos) para mostrar, de lo contrario se imprime un mensaje.
            if ($dataProductos = $categoria->categoriasProducto()) {
                // Se recorren los registros ($dataProductos) fila por fila ($rowProducto).
                foreach ($dataProductos as $rowProductos) {
                    // Se imprimen las celdas con los datos de los productos.
                    $pdf->cell(58, 10, utf8_decode($rowProductos['nombreProducto']), 'B', 0, 'C');
                    $pdf->cell(31, 10, utf8_decode($rowProductos['nombreSubCategoriaP']), 'B', 0, 'C');
                    $pdf->cell(46, 10, utf8_decode($rowProductos['nombreMarca']), 'B', 0, 'C');
                    $pdf->cell(31, 10, utf8_decode($rowProductos['nombreProveedor']), 'B', 0,'C');
                    $pdf->cell(20, 10, $rowProductos['precioProducto'], 'B', 1, 'C');
                    $pdf->ln(5);
                }
            } else {
                $pdf->cell(0, 10, utf8_decode('No hay productos con esta categoría.'), 1, 1);
            }
        } else {
            $pdf->cell(0, 10, utf8_decode('Categoría incorrecta o inexistente'), 1, 1);
        }
    }
} else {
    $pdf->cell(0, 10, utf8_decode('No hay categorias de productos para mostrar'), 1, 1);
}

// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'categoria_productos.pdf');//Envía el documento a un destino determinado: navegador, archivo o cadena-->
