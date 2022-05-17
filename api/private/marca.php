<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/marca.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $marca = new Marca;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'exception' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Accion de leer toda la información------------------.
            case 'readAll':
                if ($result['dataset'] = $marca->readAll()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            // Accion de buscar información de los colores disponibles------------------.        
            case 'search':
                if ($result['dataset'] = $marca->searchRows($_POST['search'])) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                }else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            // Accion de crear un nuevo color ------------------.       
            case 'create':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $marca->validateForm($_POST);
                if (!$marca->setMarca($_POST['nombre'])) {
                    $result['exception'] = 'Nombre inválido';
                } elseif (!is_uploaded_file($_FILES['archivo']['tmp_name'])) {
                    $result['exception'] = 'Seleccione una imagen';
                } elseif (!$marca->setImagen($_FILES['archivo'])) {
                    $result['exception'] = $subcategorias->getFileError();
                } elseif (!$marca->setEstado(1)) {
                    $result['exception'] = 'Estado inválido';
                } elseif ($marca->createRow()) {
                    $result['status'] = 1;
                    if ($marca->saveFile($_FILES['archivo'], $marca->getRuta(), $marca->getImagen())) {
                        $result['message'] = 'Marca creada correctamente';
                    } else {
                        $result['message'] = 'Marca creada pero no se guardó la imagen';
                    }
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            // Accion leer un elemento de toda la información------------------.        
            case 'readOne':
                if (!$marca->setId($_POST['id'])) {
                    $result['exception'] = 'Marca incorrecta';
                } elseif ($result['dataset'] = $marca->readOne()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Marca inexistente';
                }
                break;
            // Accion de actualizar un elemento de toda la información------------------.        
            case 'update':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $marca->validateForm($_POST);
                if (!$marca->setId($_POST['id'])) {
                    $result['exception'] = 'Marca incorrecta';
                } elseif (!$data = $marca->readOne()) {
                    $result['exception'] = 'Marca inexistente';
                }elseif (!$marca->setMarca($_POST['nombre'])) {
                    $result['exception'] = 'Nombre inválido';
                }  elseif (!$marca->setEstado($_POST['estado'])) {
                    $result['exception'] = 'Estado inválido';
                } elseif (!is_uploaded_file($_FILES['archivo']['tmp_name'])) {
                    if ($marca->updateRow($data['imagenMarca'])) {
                        $result['status'] = 1;
                        $result['message'] = 'Marca modificada correctamente';
                    } else {
                        $result['exception'] = Database::getException();
                    }
                } elseif (!$marca->setImagen($_FILES['archivo'])) {
                    $result['exception'] = $marca->getFileError();
                } elseif ($marca->updateRow($data['imagenMarca'])) {
                    $result['status'] = 1;
                    if ($marca->saveFile($_FILES['archivo'], $marca->getRuta(), $marca->getImagen())) {
                        $result['message'] = 'Subcategoría actualizada correctamente';
                    } else {
                        $result['message'] = 'Subcategoría actualizada pero no se guardó la imagen';
                    }
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            // Accion de desabilitar un elemento de toda la información------------------.      
            case 'delete':
                if (!$marca->setId($_POST['id-delete'])) {
                    $result['exception'] = 'Marca incorrecta';
                } elseif (!$marca->readOne()) {
                    $result['exception'] = 'Marca inexistente';
                } elseif ($marca->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Marca inhabilitada correctamente';
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
