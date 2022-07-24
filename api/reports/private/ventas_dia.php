<?php
require('../../helpers/dashboard_report.php');
require('../../models/pedidos.php');


// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Ventas del día');

// Se instancia el módelo Categorías para obtener los datos.
$pedido = new Pedidos;
// Se verifica si existen registros (categorías) para mostrar, de lo contrario se imprime un mensaje.
if ($datapedidos = $pedido->reportPedidosDelDia()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(175);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Times', 'B', 11);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(37, 10, utf8_decode('Número de pedido'), 1, 0, 'C', 1);
    $pdf->cell(38, 10, utf8_decode('Nombres del cliente'), 1, 0, 'C', 1);
    $pdf->cell(37, 10, utf8_decode('Apellidos del cliente'), 1, 0, 'C', 1);
    $pdf->cell(37, 10, utf8_decode('Monto'), 1, 0, 'C', 1);
    $pdf->cell(37, 10, utf8_decode('Fecha'), 1, 1, 'C', 1);

    // Se establece un color de relleno para mostrar los registros
    $pdf->setFillColor(225);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Times', '', 11);

    // Se recorren los registros ($datapedidos) fila por fila ($rowpedido).
    foreach ($datapedidos as $rowpedido) {
        // Se imprimen las celdas con los datos de los productos.
        $pdf->cell(37, 10, $rowpedido['idPedido'], 1, 0, 'C');
        $pdf->cell(38, 10, utf8_decode($rowpedido['nombresCliente']), 1, 0, 'C');
        $pdf->cell(37, 10, utf8_decode($rowpedido['apellidosCliente']), 1, 0, 'C');
        $pdf->cell(37, 10, '$'.$rowpedido['montoTotal'], 1, 0,'C');
        $pdf->cell(37, 10, $rowpedido['fechaPedido'], 1, 1, 'C');
    }
    if ($totalVentas = $pedido->reportPedidosDelDiaEstadistica()){
        $pdf->cell(93, 10, utf8_decode('Monto total de ventas'), 1, 0, 'C');
        $pdf->cell(93, 10, ('$'.$totalVentas['totalVentas']), 1, 0, 'C');
    }
    else{
        $pdf->cell(0, 10, utf8_decode('No hay total de ventas para mostrar'), 1, 1);
    }
} else {
    $pdf->cell(0, 10, utf8_decode('No hay ventas para mostrar'), 1, 1);
}

// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'productos.pdf');
