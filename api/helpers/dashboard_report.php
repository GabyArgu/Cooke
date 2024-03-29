<?php
require('../../helpers/database.php');
require('../../helpers/validaciones.php');
require('../../libraries/fpdf182/fpdf.php');

/**
*   Clase para definir las plantillas de los reportes del sitio privado. Para más información http://www.fpdf.org/
*/
class Report extends FPDF
{
    // Propiedad para guardar el título del reporte.
    private $title = null;

    /*
    *   Método para iniciar el reporte con el encabezado del documento.
    *
    *   Parámetros: $title (título del reporte).
    *
    *   Retorno: ninguno.
    */
    public function startReport($title)
    {
        // Se establece la zona horaria a utilizar durante la ejecución del reporte.
        ini_set('date.timezone', 'America/El_Salvador');
        // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en los reportes.
        session_start();
        // Se verifica si un administrador ha iniciado sesión para generar el documento, de lo contrario se direcciona a main.php
        if (isset($_SESSION['id_usuario'])) {
            // Se asigna el título del documento a la propiedad de la clase.
            $this->title = $title;
            // Se establece el título del documento (true = utf-8).
            $this->setTitle($this->title, true);
            //Se establece el nombre de la aplicación que genero el documento
            $this->setCreator('Cooke' , true);
            //Se establece el nombre del empleado que genero el documento
            $this->setAuthor(utf8_decode($_SESSION['aliasEmpleado']) , true);
            // Se establecen los margenes del documento (izquierdo, superior y derecho).
            $this->setMargins(15, 15, 15);
            // Se añade una nueva página al documento (orientación vertical y formato carta) y se llama al método header()
            $this->addPage('p', 'letter');
            // Se define un alias para el número total de páginas que se muestra en el pie del documento.
            $this->aliasNbPages();
        } else {
            header('location: ../../../views/private/dashboard.html');
        }
    }

    /*
    *   Se sobrescribe el método de la librería para establecer la plantilla del encabezado de los reportes.
    *   Se llama automáticamente en el método addPage()
    */
    public function header()
    {
        // Se establece el logo.
        $this->image('../../../resources/img/index/logo2.png', 150, 9, 50);
        
        //Añadimos la fuente poppins externa para el título del reporte y lo ubicamos
        $this->addFont('Poppins-Bold','','Poppins-Bold.php');
        $this->setFont('Poppins-Bold','',22);
        $this->SetTextColor(117, 54, 90);
        $this->cell(186, 10, utf8_decode($this->title), 0, 1, 'L');

        // Se ubica la fecha y hora del servidor.
        $this->addFont('Mohave-Light','','Mohave-Light.php');
        $this->setFont('Mohave-Light','',12);
        $this->cell(93, 15, 'Fecha/Hora: '.date('d-m-Y H:i:s'), 0, 0, 'L');
        //Mostramos el nombre de usuario que ha generado el reporte
        $this->cell(93, 15, utf8_decode('Reporte generado por: '.$_SESSION['aliasEmpleado']), 0, 1, 'R');
        // Se agrega un salto de línea para mostrar el contenido principal del documento.
        $this->ln(10);
    }

    /*
    *   Se sobrescribe el método de la librería para establecer la plantilla del pie de los reportes.
    *   Se llama automáticamente en el método output()
    */
    public function footer()
    {
        //Dibujamos línea de footer
        $this->SetDrawColor(195, 78, 139);
        $this->SetLineWidth(0.3);
        $this->Line(15, 264, 200, 264);
        // Se establece la posición para el número de página (a 15 milimetros del final).
        $this->setY(-15);
        // Se establece la fuente para el número de página.
        $this->setFont('Arial', 'I', 8);
        // Se imprime una celda con el número de página.
        $this->cell(0, 10, utf8_decode('Página ').$this->pageNo().'/{nb}', 0, 0, 'C');
    }
}
/* COLORES
* márfil: 245, 245, 245
* rosado pálido plus: 252, 242, 244
* rosado pálido: 247, 218, 223
* rosado: 210, 132, 174
* rosado fuerte: 195, 78, 139
* rosado más oscuro: 117, 54, 90
*/
?>


