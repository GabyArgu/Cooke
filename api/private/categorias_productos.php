<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/categorias_productos.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $categoria = new categoriaCP;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'exception' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $categoria->readAll()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'search':
                $_POST = $categoria->validateForm($_POST);
                if ($_POST['search'] == '') {
                    $result['exception'] = 'Ingrese un valor para buscar';
                } elseif ($result['dataset'] = $categoria->searchRows($_POST['search'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Valor encontrado';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            case 'create':
                $_POST = $categoria->validateForm($_POST);
                if (!$categoria->setNombre($_POST['nombreCP'])) {
                    $result['exception'] = 'Nombre de categoria inválido';
                }elseif (!$categoria->setDescripcion($_POST['descripcionCP'])) {
                    $result['exception'] = 'Descripción inválida';
                } elseif ($categoria->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Categoria de productos agregada correctamente.';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'readOne':
                if (!$categoria->setId($_POST['id'])) {
                    $result['exception'] = 'Error con el ID';
                } elseif ($result['dataset'] = $categoria->readOne()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Categoria de productos inexistente';
                }
                break;
            case 'update':
                $_POST = $categoria->validateForm($_POST);
                if (!$categoria->setId($_POST['u_idCP'])) {
                    $result['exception'] = 'ID inválido';
                } elseif (!$data = $categoria->readOne()) {
                    $result['exception'] = 'Categoria inexistente';
                } elseif (!$categoria->setNombre($_POST['u_nombreCP'])) {
                    $result['exception'] = 'Nombre de categoria inválido';
                }elseif (!$categoria->setDescripcion($_POST['u_descripcionCP'])) {
                    $result['exception'] = 'Nombre de categoria inválido';
                } elseif (!$categoria->setEstado($_POST['u_estado'])) {
                    $result['exception'] = 'Estado inválido';
                } elseif ($categoria->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Categoria modificada correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'delete':
                if (!$categoria->setId($_POST['id-delete'])) {
                    $result['exception'] = 'Categoría incorrecta';
                } elseif (!$data = $categoria->readOne()) {
                    $result['exception'] = 'Categoría inexistente';
                } elseif ($categoria->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Categoría eliminada correctamente';
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