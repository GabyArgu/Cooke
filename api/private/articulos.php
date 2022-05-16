<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/articulos.php');

// Se comprueba si existe una acción a realizar por medio de isset, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $articulos = new Articulos;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $articulos->readAll()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'search':
                if ($result['dataset'] = $articulos->searchRows($_POST['search'])) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            case 'create':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $articulos->validateForm($_POST);
                if (!$articulos->setTitulo($_POST['titulo'])) {
                    $result['exception'] = 'Titulo inválido';
                } elseif (!$articulos->setEmpleado($_POST['autor'])) {
                    $result['exception'] = 'Autor inválido';
                } elseif (!$articulos->setFecha($_POST['fecha'])) {
                    $result['exception'] = 'Fecha inválida';
                } elseif (!$articulos->setCategoria($_POST['categoria'])) {
                    $result['exception'] = 'Categoría inválida';
                } elseif (!is_uploaded_file($_FILES['imagen']['tmp_name'])) {
                    $result['exception'] = 'Seleccione una imagen';
                } elseif (!$articulos->setImagen($_FILES['imagen'])) {
                    $result['exception'] = $articulos->getFileError();
                } elseif (!$articulos->setContenido($_POST['contenido'])) {
                    $result['exception'] = 'Contenido inválido';
                } elseif (!$articulos->setEstado(1)) {
                    $result['exception'] = 'Estado inválido';
                } elseif ($articulos->createRow()) {
                    $result['status'] = 1;
                    if ($articulos->saveFile($_FILES['imagen'], $articulos->getRuta(), $articulos->getImagen())) {
                        $result['message'] = 'Artículo creado correctamente';
                    } else {
                        $result['message'] = 'Artículo creado pero no se guardó la imagen';
                    }
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'readOne':
                if (!$articulos->setId($_POST['id'])) {
                    $result['exception'] = 'Artículo incorrecto';
                } elseif ($result['dataset'] = $articulos->readOne()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Artículo inexistente';
                }
                break;
            case 'readOneDetail':
                if (!$articulos->setId($_POST['idArticulo'])) {
                    $result['exception'] = 'Artículo incorrecto';
                } elseif ($result['dataset'] = $articulos->readOneDetail()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Artículo inexistente';
                }
                break;
            case 'update':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $articulos->validateForm($_POST);
                if (!$articulos->setId($_POST['idArticulo'])) {
                    $result['exception'] = 'Artículo incorrecto';
                } elseif (!$data = $articulos->readOne()) {
                    $result['exception'] = 'Artículo inexistente';
                } elseif (!$articulos->setTitulo($_POST['titulo'])) {
                    $result['exception'] = 'Título inválido';
                } elseif (!$articulos->setEmpleado($_POST['autor'])) {
                    $result['exception'] = 'Autor inválido';
                } elseif (!$articulos->setFecha($_POST['fecha'])) {
                    $result['exception'] = 'Fecha inválida';
                } elseif (!$articulos->setCategoria($_POST['categoria'])) {
                    $result['exception'] = 'Categoría inválida';
                } elseif (!$articulos->setEstado($_POST['estado'])) {
                    $result['exception'] = 'Estado inválido';
                } elseif (!$articulos->setContenido($_POST['contenido'])) {
                    $result['exception'] = 'Contenido inválido';
                } elseif (!is_uploaded_file($_FILES['imagen']['tmp_name'])) {
                    if ($articulos->updateRow($data['imagenArticulo'])) {
                        $result['status'] = 1;
                        $result['message'] = 'Artículo modificado correctamente';
                    } else {
                        $result['exception'] = Database::getException();
                    }
                } elseif (!$articulos->setImagen($_FILES['imagen'])) {
                    $result['exception'] = $articulos->getFileError();
                } elseif ($articulos->updateRow($data['imagenArticulo'])) {
                    $result['status'] = 1;
                    if ($articulos->saveFile($_FILES['archivo'], $articulos->getRuta(), $articulos->getImagen())) {
                        $result['message'] = 'Artículo actualizado correctamente';
                    } else {
                        $result['message'] = 'Artículo actualizado pero no se guardó la imagen';
                    }
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'delete':
                if (!$articulos->setId($_POST['id-delete'])) {
                    $result['exception'] = 'Artículo incorrecto';
                } elseif (!$articulos->readOne()) {
                    $result['exception'] = 'Artículo inexistente';
                } elseif ($articulos->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Artículo inhabilitado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            default:
                $result['exception'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        print(json_encode('Acceso denegado'));
    }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
