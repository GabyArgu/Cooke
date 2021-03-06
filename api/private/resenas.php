<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/resenas.php');

// Se comprueba si existe una acción a realizar por medio de isset, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $resena = new Reseñas;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Accion de leer toda la información------------------.
            case 'readAll':
                if ($result['dataset'] = $resena->readAll()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            // Accion de buscar información de las reseñas existencias------------------.     
            case 'search':
                if ($result['dataset'] = $resena->searchRows($_POST['search'])) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            // Accion leer un elemento de toda la información------------------.       
            case 'readOne':
                if (!$resena->setId($_POST['idResena'])) {
                    $result['exception'] = 'Reseña incorrecta';
                } elseif ($result['dataset'] = $resena->readOne()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Reseña inexistente';
                }
                break;
            // Accion de leer los detalles de la reseña ------------------.     
            case 'readOneDetail':
                if (!$resena->setId($_POST['idResena'])) {
                    $result['exception'] = 'Reseña incorrecta';
                } elseif ($result['dataset'] = $resena->readOneDetail()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Reseña inexistente';
                }
                break;
            // Accion de actualizar un elemento de toda la información------------------.     
            case 'update':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $resena->validateForm($_POST);
                if (!$resena->setId($_POST['id-resena'])) {
                    $result['exception'] = 'Reseña incorrecta';
                } elseif (!$resena->readOne()) {
                    $result['exception'] = 'Reseña inexistente';
                } elseif (!$resena->setEstado($_POST['estado-resena'])) {
                    $result['exception'] = 'Estado inválido';
                } elseif ($resena->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Reseña modificada correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            // Accion de desabilitar un elemento de toda la información------------------.        
            case 'delete':
                if (!$resena->setId($_POST['idResena'])) {
                    $result['exception'] = 'Reseña incorrecta';
                } elseif (!$data = $resena->readOne()) {
                    $result['exception'] = 'Reseña inexistente';
                } elseif ($resena->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Reseña inhabilitada correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            default:
                $result['exception'] = 'Acción no disponible dentro de la sesión';
        }
    }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
