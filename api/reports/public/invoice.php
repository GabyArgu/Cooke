<?php
require('../../helpers/public_report.php');
require('../../models/pedidos.php');


// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('COMPROBANTE DE COMPRA');

//Dibujando línea
$pdf->SetLineWidth(15);
$pdf->SetDrawColor(195, 78, 139);
$pdf->Line(0, 0, 215, 0);
$pdf->SetLineWidth(0.2);
//Saltos de línea
$pdf->ln(10);
$pdf->ln(10);

// Se instancia el módelo Categorías para obtener los datos.
$pedido = new Pedidos;
    if ($infoPedido = $pedido->readInfoInvoice()) {
        //Añadimos la fuente poppins externa para el título del reporte
        $pdf->SetTextColor(117, 54, 90);
        $pdf->addFont('Mohave-Bold','','Mohave-Bold.php');
        $pdf->addFont('Mohave-Light','','Mohave-Light.php');
        $pdf->setFont('Mohave-Bold','',14);
        //especificamos el color de las celdas rellenas
        $pdf->setFillColor(247, 218, 223);
        //$pdf->setFillColor(225);
        $pdf->cell(70, 10, utf8_decode('Datos del cliente'), 0, 0, 'C', 1);
        $pdf->cell(46, 10, "", 0, 0, 'C');
        $pdf->cell(70, 10, utf8_decode('Fecha/hora'), 0, 0, 'C', 1);
        $pdf->ln(10);

        $pdf->setFont('Mohave-Light','',12);
        $pdf->cell(70, 10, utf8_decode($infoPedido['nombresCliente']), 0, 0, 'C');
        $pdf->cell(46, 10, "", 0, 0, 'C');
        $pdf->cell(70, 10, date('d-m-Y H:i:s'), 0, 0, 'C');
        $pdf->ln(10);

        $pdf->cell(70, 10, utf8_decode($infoPedido['apellidosCliente']), 0, 0, 'C');
        $pdf->cell(46, 10, "", 0, 0, 'C');
        $pdf->setFont('Mohave-Bold','',14);

        $pdf->cell(70, 10, utf8_decode('Número de pedido'), 0, 0, 'C', 1);
        $pdf->ln(10);
        $pdf->setFont('Mohave-Light','',12);
        
        $pdf->cell(70, 10, utf8_decode("DUI: ".$infoPedido['duiCliente']), 0, 0, 'C');
        $pdf->cell(46, 10, "", 0, 0, 'C');
        $pdf->cell(70, 10, utf8_decode($infoPedido['idPedido']), 0, 0, 'C');
        $pdf->ln(10);
        $pdf->ln(10);

        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(247, 218, 223);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Mohave-Bold','',12);
        // Se imprimen las celdas con los encabezados.
        $pdf->cell(40, 10, utf8_decode('Cantidad'), 0, 0, 'C', 1);
        $pdf->cell(54, 10, utf8_decode('Productos'), 0, 0, 'C', 1);
        $pdf->cell(46, 10, utf8_decode('Precio unitario (USD)'), 0, 0, 'C', 1);
        $pdf->cell(46, 10, utf8_decode('Monto (USD)'), 0, 0, 'C', 1);
        $pdf->ln(10);

        if ($datafactura = $pedido->readInvoice()) {
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Mohave-Light','',12);
            //Se establece el color de las líneas de la tabla
            $pdf->SetDrawColor(247, 218, 223);
            foreach ($datafactura as $rowFactura) {
                // Se imprimen las celdas con los datos de los productos.
                //El parametro B es para poner bordes solo en bottom
                $pdf->cell(40, 10, $rowFactura['cantidadProducto'], 'B', 0, 'C');
                $pdf->cell(54, 10, utf8_decode($rowFactura['nombreProducto']), 'B', 0, 'C');
                $pdf->cell(46, 10, '$'.$rowFactura['precioUnitario'], 'B', 0,'C');
                $pdf->cell(46, 10, '$'.$rowFactura['montoProducto'], 'B', 1, 'C');
            }
        }
        $pdf->ln(10);
        //Si se pudo obtener el monto se procede a mostrarlo, se guardan todos los datos en el array $monto
        if ($monto = $pedido->readMontoInvoice()){
            //Definimos el color del cuadro de totales
            $pdf->setFillColor(245, 245, 245);
            //Dibujamos todas las celdas, dejando la primera celda vacía a modo de espaciado
            $pdf->cell(94, 10, "", 0, 0, 'C');
            $pdf->cell(46, 10, "Subtotal", 'B', 0, 'C', 1);
            $pdf->cell(46, 10, "$".$monto['monto'], 'B', 0, 'C', 1);
            $pdf->ln(10);
            $pdf->cell(94, 10, "", 0, 0, 'C');
            $pdf->cell(46, 10, utf8_decode("Envío"), 'B', 0, 'C', 1);
            $pdf->cell(46, 10, "$2.00", 'B', 0, 'C', 1);
            $pdf->ln(10);
            $pdf->cell(94, 10, "", 0, 0, 'C');
            //Resaltamos el dato del monto aumentando el tamaño de la fuente 
            $pdf->setFont('Mohave-Bold','',14);
            $pdf->cell(46, 10, "Total", 0, 0, 'C', 1);
            $pdf->cell(46, 10, ("$".$monto['monto'] + 2), 0, 0, 'C', 1);

            //Restablecemos la fuente que cambiamos para el total
            $pdf->setFont('Mohave-Light','',12);
            $pdf->ln(30);
            $pdf->cell(94, 10, "F:__________________________________", 0, 0, 'L');
        }
        else{
            $pdf->cell(0, 10, utf8_decode('No hay detalle para mostrar'), 1, 1);
        }
    } else { 
        header('location: ../../../views/public/carrito.html');
    }

// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'productos.pdf');
