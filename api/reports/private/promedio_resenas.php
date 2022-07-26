<?php
require('../../helpers/dashboard_report.php');
require('../../models/resenas.php');


// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Valoraciones de productos');

//Dibujando línea
$pdf->SetLineWidth(15);// Define el ancho de línea -->
$pdf->SetDrawColor(195, 78, 139);//Define el color utilizado para todas las operaciones de dibujo (líneas, rectángulos y bordes de celda)-->
$pdf->Line(0, 0, 215, 0);//Dibuja una línea-->

$pdf->SetLineWidth(0.2);
$pdf->SetDrawColor(247, 218, 223);
$pdf->SetTextColor(117, 54, 90);//Define el color del texto-->
//Saltos de línea
//$pdf->ln(10);//Realiza un salto de línea-->

// Se instancia el módelo Categorías para obtener los datos.
$resena = new Reseñas;
// Se verifica si existen registros (categorías) para mostrar, de lo contrario se imprime un mensaje.
if ($dataResenas = $resena->promedioResenas()) {
    $pdf->setFillColor(247, 218, 223);//Define el color utilizado para todas las operaciones de relleno (rectángulos rellenos y fondos de celda)-->
    $pdf->SetTextColor(117, 54, 90);
    // Se establece la fuente para los encabezados.
    $pdf->addFont('Mohave-Bold', '', 'Mohave-Bold.php');//Importa una fuente y la pone a disposición-->
    $pdf->addFont('Mohave-Light', '', 'Mohave-Light.php');
    $pdf->setFont('Mohave-Bold', '', 14);//Establece la fuente utilizada para imprimir cadenas de caracteres-->
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(100, 10, utf8_decode('Producto'), 0, 0, 'C', 1);//Imprime una celda (área rectangular) con bordes opcionales, color de fondo y cadena de caracteres-->
    $pdf->cell(86, 10, utf8_decode('Promedio de valoraciones'), 0, 0, 'C', 1);
    $pdf->ln();

    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Mohave-Light', '', 12);

    // Se recorren los registros ($datapedidos) fila por fila ($rowpedido).
    foreach ($dataResenas as $rowResena) {
        // Se imprimen las celdas con los datos de los productos.
        $pdf->cell(100, 10, utf8_decode($rowResena['nombreProducto']), 'B', 0, 'C');
        $pdf->cell(86, 10, $rowResena['puntaje'], 'B', 0, 'C');
        $pdf->ln();
    }
} else {
    $pdf->cell(0, 10, utf8_decode('No hay valoraciones de productos'), 1, 1);
}

// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'valoraciones.pdf');//Envía el documento a un destino determinado: navegador, archivo o cadena-->
