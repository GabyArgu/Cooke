<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/pedidos.php');

// Se comprueba si existe una acción a realizar por medio de isset, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $pedido = new Pedidos;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $pedido->readAll()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'search':
                if ($result['dataset'] = $pedido->searchRows($_POST['search'])) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
                case 'update':
                    //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                    $_POST = $pedido->validateForm($_POST);
                    if (!$pedido->setId($_POST['id-u'])) {
                        $result['exception'] = 'Pedido incorrecto';
                    } elseif (!$pedido->readOne()) {
                        $result['exception'] = 'Pedido inexistente';
                    } elseif (!$pedido->setEstado($_POST['estado-pedido'])) {
                        $result['exception'] = 'Estado inválido';
                    } elseif ($pedido->updateRow()) {
                        $result['status'] = 1;
                        $result['message'] = 'Pedido modificado correctamente';
                    } else {
                        $result['exception'] = Database::getException();
                    }
                    break;
            case 'readOne':
                if (!$pedido->setId($_POST['id-det'])) {
                    $result['exception'] = 'Pedido incorrecto';
                } elseif ($result['dataset'] = $pedido->readOne()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Pedido inexistente';
                }
                break;
            case 'readOneShow':
                if (!$pedido->setId($_POST['id-det'])) {
                    $result['exception'] = 'Pedido incorrecto';
                } elseif ($result['dataset'] = $pedido->readOneShow()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Pedido inexistente';
                }
                break;
            case 'readOneDPShow':
                if (!$pedido->setId($_POST['id-det'])) {
                    $result['exception'] = 'Pedido incorrecto';
                } elseif ($result['dataset'] = $pedido->readOneDPShow()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Pedido inexistente';
                }
            default:
                $result['exception'] = 'Acción no disponible dentro de la sesión';
        }
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
