<?php
require('../../helpers/dashboard_report.php');
require('../../models/usuarios.php');
require('../../models/cargo_empleado.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('EMPLEADOS POR CARGO');

//Dibujando línea
$pdf->SetLineWidth(15);
$pdf->SetDrawColor(195, 78, 139);
$pdf->Line(0, 0, 215, 0);
$pdf->SetLineWidth(0.2);
//Saltos de línea
$pdf->ln(10);
$pdf->ln(10);

// Se instancia el módelo Categorías para obtener los datos.
$cargo = new CargoEmpleado;
// Se verifica si existen registros (categorías) para mostrar, de lo contrario se imprime un mensaje.
if ($dataCargos = $cargo->readAll()) {
    $pdf->SetTextColor(117, 54, 90);
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(247, 218, 223);
    // Se establece la fuente para los encabezados.
    $pdf->addFont('Mohave-Bold','','Mohave-Bold.php');
    $pdf->addFont('Mohave-Light','','Mohave-Light.php');
    $pdf->setFont('Mohave-Bold','',14);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(37, 10, utf8_decode('Nombres'), 0, 0, 'C', 1);
    $pdf->cell(38, 10, utf8_decode('Apellidos'), 0, 0, 'C', 1);
    $pdf->cell(48, 10, utf8_decode('Correo'), 0, 0, 'C', 1);
    $pdf->cell(32, 10, utf8_decode('Teléfono'), 0, 0, 'C', 1);
    $pdf->cell(31, 10, utf8_decode('Estado'), 0, 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(252, 242, 244);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Mohave-Light','', 12);

    // Se recorren los registros ($dataCategorias) fila por fila ($rowCategoria).
    foreach ($dataCargos as $rowCargo) {
        // Se imprime una celda con el nombre de la categoría.
        $pdf->cell(0, 10, utf8_decode('Cargo: '.$rowCargo['cargoEmpleado']), 0, 1, 'C', 1);
        // Se instancia el módelo Productos para procesar los datos.
        $empleado = new Usuarios;
        // Se establece la categoría para obtener sus productos, de lo contrario se imprime un mensaje de error.
        if ($empleado->setCargo($rowCargo['idCargoEmpleado'])) {
            // Se verifica si existen registros (productos) para mostrar, de lo contrario se imprime un mensaje.
            if ($dataEmpleados = $empleado->empleadosCargo()) {
                // Se recorren los registros ($dataProductos) fila por fila ($rowProducto).
                foreach ($dataEmpleados as $rowEmpleado) {
                    // Se imprimen las celdas con los datos de los productos.
                    $pdf->cell(37, 10, $rowEmpleado['nombresEmpleado'], 'B', 0, 'C');
                    $pdf->cell(38, 10, utf8_decode($rowEmpleado['apellidosEmpleado']), 'B', 0, 'C');
                    $pdf->cell(48, 10, utf8_decode($rowEmpleado['correoEmpleado']), 'B', 0, 'C');
                    $pdf->cell(32, 10, $rowEmpleado['telefonoEmpleado'], 'B', 0,'C');
                    $pdf->cell(31, 10, $rowEmpleado['estadoEmpleado'], 'B', 1, 'C');
                    $pdf->ln(5);
                }
            } else {
                $pdf->cell(0, 10, utf8_decode('No hay empleados con este cargo.'), 1, 1);
            }
        } else {
            $pdf->cell(0, 10, utf8_decode('Cargo incorrecto o inexistente'), 1, 1);
        }
    }
} else {
    $pdf->cell(0, 10, utf8_decode('No hay cargos de empleado para mostrar'), 1, 1);
}

// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'empleados.pdf');
