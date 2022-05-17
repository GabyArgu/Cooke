<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/proveedor.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $proveedor = new Proveedor;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'exception' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $proveedor->readAll()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'search':
                if ($result['dataset'] = $proveedor->searchRows($_POST['search2'])) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                }else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            case 'create':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $proveedor->validateForm($_POST);
                if (!$proveedor->setProveedor($_POST['nombre-prov'])) {
                    $result['exception'] = 'Nombre inválido';
                } elseif (!$proveedor->setEstado(1)) {
                    $result['exception'] = 'Estado inválido';
                } elseif (!$proveedor->setDireccion($_POST['direccion-prov'])) {
                    $result['exception'] = 'Dirección inválida';
                }elseif (!$proveedor->setTelefono($_POST['telefono-prov'])) {
                    $result['exception'] = 'Telefono inválido';
                }elseif ($proveedor->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Proveedor creado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'readOne':
                if (!$proveedor->setId($_POST['id-prov'])) {
                    $result['exception'] = 'Proveedor incorrecto';
                } elseif ($result['dataset'] = $proveedor->readOne()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Proveedor inexistente';
                }
                break;
            case 'update':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $proveedor->validateForm($_POST);
                if (!$proveedor->setId($_POST['id-prov'])) {
                    $result['exception'] = 'Proveedor incorrecto';
                } elseif (!$data = $proveedor->readOne()) {
                    $result['exception'] = 'Proveedor inexistente';
                }elseif (!$proveedor->setProveedor($_POST['nombre-prov'])) {
                    $result['exception'] = 'Nombre inválido';
                } elseif (!$proveedor->setEstado($_POST['estado2'])) {
                    $result['exception'] = 'Estado inválido';
                } elseif (!$proveedor->setDireccion($_POST['direccion-prov'])) {
                    $result['exception'] = 'Dirección inválida';
                }elseif (!$proveedor->setTelefono($_POST['telefono-prov'])) {
                    $result['exception'] = 'Telefono inválido';
                } elseif ($proveedor->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Proveedor actualizado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'readOneShow':
                    if (!$proveedor->setId($_POST['id-prov'])) {
                        $result['exception'] = 'Proveedor incorrecto';
                    } elseif ($result['dataset'] = $proveedor->readOneShow()) {
                        $result['status'] = 1;
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = 'Empleado inexistente';
                    }
                    break;
            case 'delete':
                if (!$proveedor->setId($_POST['id-delete'])) {
                    $result['exception'] = 'Proveedor incorrecto';
                } elseif (!$proveedor->readOne()) {
                    $result['exception'] = 'Proveedor inexistente';
                } elseif ($proveedor->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Proveedor inhabilitado correctamente';
                } else {
                    $result['exception'] = Database::getException();
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
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
