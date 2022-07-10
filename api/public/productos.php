<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/productos.php');

// Se comprueba si existe una acción a realizar por medio de isset, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $productos = new Productos;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    
        switch ($_GET['action']) {
            case 'readDestacados':
                if ($result['dataset'] = $productos->readDestacados()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No existen productos destacados';
                }
                break;
            case 'readOne':
                if (!$productos->setId($_POST['id'])) {
                    $result['exception'] = 'Producto incorrecto';
                } elseif ($result['dataset'] = $productos->readOne()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Producto inexistente';
                }
                break;
            case 'readOneShow':
                    if (!$productos->setId($_POST['id'])) {
                        $result['exception'] = 'Producto incorrecto';
                    } elseif ($result['dataset'] = $productos->readOneShow()) {
                        $result['status'] = 1;
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = 'Producto inexistente';
                    }
                    break;  
            default:
                $result['exception'] = 'Acción no disponible dentro de la sesión';
        }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}