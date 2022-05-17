<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/colores.php');

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
            // Accion de leer toda la información------------------.
            case 'readAll':
                if ($result['dataset'] = $colores->readAll()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            // Accion de buscar información de los colores disponibles------------------.    
            case 'search':
                $_POST = $colores->validateForm($_POST);
                if ($_POST['search'] == '') {
                    $result['exception'] = 'Ingrese un valor para buscar';
                } elseif ($result['dataset'] = $colores->searchRows($_POST['search'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Valor encontrado';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            // Accion de crear un nuevo color ------------------.    
            case 'create':
                $_POST = $colores->validateForm($_POST);
                if (!$colores->setColor($_POST['colorProducto'])) {
                    $result['exception'] = 'Nombre de color inválido';
                } elseif ($colores->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Color de producto agregado correctamente.';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            // Accion leer un elemento de toda la información------------------.    
            case 'readOne':
                if (!$colores->setId($_POST['id'])) {
                    $result['exception'] = 'Error con el ID';
                } elseif ($result['dataset'] = $colores->readOne()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Color inexistente';
                }
                break;
            // Accion de actualizar un elemento de toda la información------------------.    
            case 'update':
                $_POST = $colores->validateForm($_POST);
                if (!$colores->setId($_POST['u_idColor'])) {
                    $result['exception'] = 'ID inválido';
                } elseif (!$data = $colores->readOne()) {
                    $result['exception'] = 'Color inexistente';
                } elseif (!$colores->setColor($_POST['u_colorProducto'])) {
                    $result['exception'] = 'Nombre de color inválido';
                } elseif (!$colores->setEstado($_POST['u_estado'])) {
                    $result['exception'] = 'Estado inválido';
                } elseif ($colores->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Color modificado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            // Accion de desabilitar un elemento de toda la información------------------.    
            case 'delete':
                if (!$colores->setId($_POST['id-delete'])) {
                    $result['exception'] = 'Color incorrecta';
                } elseif (!$data = $colores->readOne()) {
                    $result['exception'] = 'Color inexistente';
                } elseif ($colores->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Color eliminado correctamente';
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