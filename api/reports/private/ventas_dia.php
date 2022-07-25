<?php
require('../../helpers/dashboard_report.php');
require('../../models/pedidos.php');


// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Ventas del día');

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

// Se instancia el módelo Categorías para obtener los datos.
$pedido = new Pedidos;
// Se verifica si existen registros (categorías) para mostrar, de lo contrario se imprime un mensaje.
if ($datapedidos = $pedido->reportPedidosDelDia()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(247, 218, 223);
    // Se establece la fuente para los encabezados.
    
    $pdf->setFont('Mohave-Bold','',12);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(19, 10, utf8_decode('N° pedido'), 1, 0, 'C', 1);
    $pdf->cell(37, 10, utf8_decode('Nombres cliente'), 1, 0, 'C', 1);
    $pdf->cell(37, 10, utf8_decode('Apellidos cliente'), 1, 0, 'C', 1);
    $pdf->cell(31, 10, utf8_decode('Monto'), 1, 0, 'C', 1);
    $pdf->cell(31, 10, utf8_decode('Tipo de pago'), 1, 0, 'C', 1);
    $pdf->cell(31, 10, utf8_decode('Fecha'), 1, 1, 'C', 1);

    // Se establece un color de relleno para mostrar los registros
    $pdf->setFillColor(225);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Mohave-Light','',12);

    // Se recorren los registros ($datapedidos) fila por fila ($rowpedido).
    foreach ($datapedidos as $rowpedido) {
        // Se imprimen las celdas con los datos de los productos.
        $pdf->cell(19, 10, $rowpedido['idPedido'], 'B', 0, 'C');
        $pdf->cell(37, 10, utf8_decode($rowpedido['nombresCliente']), 'B', 0, 'C');
        $pdf->cell(37, 10, utf8_decode($rowpedido['apellidosCliente']), 'B', 0, 'C');
        $pdf->cell(31, 10, '$'.number_format(($rowpedido['montoTotal']+2), 2, '.', ""), 'B', 0,'C'); //
        $pdf->cell(31, 10, utf8_decode($rowpedido['tipoPago']), 'B', 0,'C');
        $pdf->cell(31, 10, $rowpedido['fechaPedido'], 'B', 1, 'C');
    }
    $pdf->cell(93, 10, utf8_decode('Montos totales incluyen el envío'), 0, 0, 'L', 0);
    //Salto de línea
    $pdf->ln(20);
    //Definimos el color del cuadro de totales
    $pdf->setFillColor(245, 245, 245);
    if ($totalVentas = $pedido->reportPedidosDelDiaEstadistica()){
        $pdf->setFont('Mohave-Bold','',12);
        $pdf->cell(93, 10, utf8_decode('Monto total de ventas en el día:'), 0, 0, 'C', 1);
        $pdf->cell(93, 10, '$'.number_format(($totalVentas['totalVentas']), 2, '.', ""), 0, 0, 'C', 1);
    }
    else{
        $pdf->cell(0, 10, utf8_decode('No hay total de ventas para mostrar'), 1, 1);
    }
} else {
    $pdf->cell(0, 10, utf8_decode('No hay ventas para mostrar'), 1, 1);
}

// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'productos.pdf');
