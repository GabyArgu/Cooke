<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/etiqueta.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $colores = new colorProducto;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'exception' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $etiqueta->readAll()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'search':
                $_POST = $etiqueta->validateForm($_POST);
                if ($_POST['search'] == '') {
                    $result['exception'] = 'Ingrese un valor para buscar';
                } elseif ($result['dataset'] = $etiqueta->searchRows($_POST['search'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Valor encontrado';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            case 'create':
                $_POST = $etiqueta->validateForm($_POST);
                if (!$etiqueta->set($_POST['nombre_etiqueta'])) {
                    $result['exception'] = 'Nombre de Etiqueta inválido';
                } elseif ($etiqueta->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Etiqueta de producto agregada correctamente.';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'readOne':
                if (!$etiqueta->setId($_POST['id'])) {
                    $result['exception'] = 'Error con el ID';
                } elseif ($result['dataset'] = $etiqueta->readOne()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Etiqueta inexistente';
                }
                break;
            case 'update':
                $_POST = $etiqueta->validateForm($_POST);
                if (!$etiqueta->setId($_POST['u_idEtiqueta'])) {
                    $result['exception'] = 'ID inválido';
                } elseif (!$data = $etiqueta->readOne()) {
                    $result['exception'] = 'Etiqueta inexistente';
                } elseif (!$etiqueta->setNombreEtiqueta($_POST['u_nombreEtiqueta'])) {
                    $result['exception'] = 'Nombre de Etiqueta inválido';
                } elseif (!$etiqueta->setEstado($_POST['u_idEstado'])) {
                    $result['exception'] = 'Estado inválido';
                } elseif ($etiqueta->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Etiqueta modificada correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'delete':
                if (!$etiqueta->setId($_POST['id'])) {
                    $result['exception'] = 'Etiqueta incorrecta';
                } elseif (!$data = $etiqueta->readOne()) {
                    $result['exception'] = 'Etiqueta inexistente';
                } elseif ($etiqueta->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Etiqueta eliminada correctamente';
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