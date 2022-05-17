<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/comentarios.php');

// Se comprueba si existe una acción a realizar por medio de isset, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $comentarios = new Comentarios;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Accion de leer toda la información------------------.
            case 'readAll':
                if ($result['dataset'] = $comentarios->readAll()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            // Accion de buscar información de los comentarios existentes------------------.        
            case 'search':
                if ($result['dataset'] = $comentarios->searchRows($_POST['search'])) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            // Accion leer un elemento de toda la información------------------.     
            case 'readOne':
                if (!$comentarios->setId($_POST['idComentario'])) {
                    $result['exception'] = 'Comentario incorrecto';
                } elseif ($result['dataset'] = $comentarios->readOne()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Comentario inexistente';
                }
                break;
            // Accion leer los detalles en el modal------------------.     
            case 'readOneDetail':
                if (!$comentarios->setId($_POST['idComentario'])) {
                    $result['exception'] = 'Comentario incorrecto';
                } elseif ($result['dataset'] = $comentarios->readOneDetail()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Comentario inexistente';
                }
                break;
            // Accion de actualizar un elemento de toda la información------------------.    
            case 'update':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post------------.
                $_POST = $comentarios->validateForm($_POST);
                if (!$comentarios->setId($_POST['id-comentario'])) {
                    $result['exception'] = 'Comentario incorrecto';
                } elseif (!$comentarios->readOne()) {
                    $result['exception'] = 'Comentario inexistente';
                } elseif (!$comentarios->setEstado($_POST['estado-comentario'])) {
                    $result['exception'] = 'Estado inválido';
                } elseif ($comentarios->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Comentario modificado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            // Accion de desabilitar un elemento de toda la información------------------.     
            case 'delete':
                if (!$comentarios->setId($_POST['idComentario'])) {
                    $result['exception'] = 'Comentario incorrecto';
                } elseif (!$data = $comentarios->readOne()) {
                    $result['exception'] = 'Comentario inexistente';
                } elseif ($comentarios->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Comentario inhabilitado correctamente';
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
