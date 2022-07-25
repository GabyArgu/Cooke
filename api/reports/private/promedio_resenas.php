<?php
require('../../helpers/dashboard_report.php');
require('../../models/resenas.php');


// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Valoraciones de productos');

//Dibujando línea
$pdf->SetLineWidth(15);
$pdf->SetDrawColor(195, 78, 139);
$pdf->Line(0, 0, 215, 0);

$pdf->SetLineWidth(0.2);
$pdf->SetDrawColor(247, 218, 223);
$pdf->SetTextColor(117, 54, 90);
//Saltos de línea
$pdf->ln(10);

// Se instancia el módelo Categorías para obtener los datos.
$resena = new Reseñas;
// Se verifica si existen registros (categorías) para mostrar, de lo contrario se imprime un mensaje.
if ($dataResenas = $resena->promedioResenas()) {
    $pdf->setFillColor(247, 218, 223);
    $pdf->SetTextColor(117, 54, 90);
    // Se establece la fuente para los encabezados.
    $pdf->addFont('Mohave-Bold', '', 'Mohave-Bold.php');
    $pdf->addFont('Mohave-Light', '', 'Mohave-Light.php');
    $pdf->setFont('Mohave-Bold', '', 14);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(100, 10, utf8_decode('Producto'), 0, 0, 'C', 1);
    $pdf->cell(86, 10, utf8_decode('Promedio de valoraciones'), 0, 0, 'C', 1);
    $pdf->ln();

    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Mohave-Light', '', 12);

    // Se recorren los registros ($datapedidos) fila por fila ($rowpedido).
    foreach ($dataResenas as $rowResena) {
        // Se imprimen las celdas con los datos de los productos.
        $pdf->cell(100, 10, $rowResena['nombreProducto'], 'B', 0, 'C');
        $pdf->cell(86, 10, $rowResena['puntaje'], 'B', 0, 'C');
        $pdf->ln();
    }
} else {
    $pdf->cell(0, 10, utf8_decode('No hay valoraciones de productos'), 1, 1);
}

// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'valoraciones.pdf');
