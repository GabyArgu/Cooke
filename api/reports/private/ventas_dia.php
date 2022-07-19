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
if ($datapedidos = $pedido->readVentasDay()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(175);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Times', 'B', 11);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(50, 10, utf8_decode('Nombres'), 1, 0, 'C', 1);
    $pdf->cell(50, 10, utf8_decode('Apellidos'), 1, 0, 'C', 1);
    $pdf->cell(30, 10, utf8_decode('Monto (US$)'), 1, 0, 'C', 1);
    $pdf->cell(30, 10, utf8_decode('Fecha'), 1, 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(225);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Times', '', 11);

    // Se recorren los registros ($datapedidos) fila por fila ($rowpedido).
    foreach ($datapedidos as $rowpedido) {
        // Se imprime una celda con el nombre de la categoría.
        $pdf->cell(0, 10, utf8_decode('Categoría: '.$rowpedido['nombre_pedido']), 1, 1, 'C', 1);
        // Se instancia el módelo Productos para procesar los datos.
        $producto = new Productos;
        // Se recorren los registros ($dataProductos) fila por fila ($rowProducto).
        foreach ($dataProductos as $rowProducto) {
            // Se imprimen las celdas con los datos de los productos.
            $pdf->cell(50, 10, utf8_decode($rowProducto['nombresCliente']), 1, 0);
            $pdf->cell(50, 10, utf8_decode($rowProducto['apellidosCliente']), 1, 0);
            $pdf->cell(30, 10, $rowProducto['montoTotal'], 1, 0);
            $pdf->cell(30, 10, $rowProducto['fechaPedido'], 1, 1);
        }
    }
} else {
    $pdf->cell(0, 10, utf8_decode('No hay ventas para mostrar'), 1, 1);
}

// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'productos.pdf');
