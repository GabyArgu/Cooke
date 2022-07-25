<?php
require('../../helpers/dashboard_report.php');
require('../../models/pedidos.php');


// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Ventas del Mes');

//Dibujamos franja de arriba
$pdf->SetLineWidth(15);
$pdf->SetDrawColor(195, 78, 139);
$pdf->Line(0, 0, 215, 0);

//restablecemos valores por defecto y seteamos color de líneas y de fuentes
$pdf->SetLineWidth(0.2);
$pdf->SetDrawColor(247, 218, 223);
$pdf->SetTextColor(117, 54, 90);

//Agregamos fuentes externas
$pdf->addFont('Mohave-Bold','','Mohave-Bold.php');
$pdf->addFont('Mohave-Light','','Mohave-Light.php');

$pedido = new Pedidos;
// Se verifica si existen registros (categorías) para mostrar, de lo contrario se imprime un mensaje.
if ($datapedidos = $pedido->reportPedidosDelMes()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(247, 218, 223);
    // Se establece la fuente para los encabezados.
    
    $pdf->setFont('Mohave-Bold','',12);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(62, 10, utf8_decode('N° Ventas'), 1, 0, 'C', 1);
    $pdf->cell(62, 10, utf8_decode('Ingresos'), 1, 0, 'C', 1);
    $pdf->cell(62, 10, utf8_decode('Día'), 1, 1, 'C', 1);

    // Se establece un color de relleno para mostrar los registros
    $pdf->setFillColor(225);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Mohave-Light','',12);

    // Se recorren los registros ($datapedidos) fila por fila ($rowpedido).
    foreach ($datapedidos as $rowpedido) {
        // Se imprimen las celdas con los datos de los productos.
        $pdf->cell(62, 10, $rowpedido['Ventas'], 'B', 0, 'C');
        $pdf->cell(62, 10, '$'.$rowpedido['Ingresos'], 'B', 0,'C'); //number_format(($rowpedido['montoTotal']+2), 2, '.', "");
        $pdf->cell(62, 10, utf8_decode($rowpedido['Día']), 'B', 1, 'C');
    }

    
} else {
    $pdf->cell(0, 10, utf8_decode('No hay ventas para mostrar'), 1, 1);
}

// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'productos.pdf');