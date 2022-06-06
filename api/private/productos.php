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
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $productos->readAll()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'search':
                if ($result['dataset'] = $productos->searchRows($_POST['search'])) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                }else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            case 'create':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $productos->validateForm($_POST);
                if (!$productos->setNombre($_POST['nombre'])) {
                    $result['exception'] = 'Nombre inválido';
                }  elseif (!$productos->setDescripcion($_POST['descripcion'])) {
                    $result['exception'] = 'Descripción inválida';
                } elseif (!$productos->setSubcategoria($_POST['subcategoria'])){
                    $result['exception'] = 'Subcategoría inválida';
                } elseif (!$productos->setProveedor($_POST['proveedor'])){
                    $result['exception'] = 'Proveedor inválido';
                } elseif (!$productos->setMarca($_POST['marca'])){
                    $result['exception'] = 'marca inválida';
                } elseif (!$productos->setPrecio($_POST['precio'])){
                    $result['exception'] = 'Categoría inválida';
                } elseif (!$productos->setColor($_POST['color'])){
                    $result['exception'] = 'Color inválido';
                }elseif (!$productos->setDescuento($_POST['descuento'])){
                    $result['exception'] = 'Descuento inválido';
                }elseif (!$productos->setStock($_POST['stock'])){
                    $result['exception'] = 'Stock inválido';
                }  elseif (!is_uploaded_file($_FILES['archivo']['tmp_name'])) {
                    $result['exception'] = 'Seleccione una imagen';
                } elseif (!$productos->setImagen($_FILES['archivo'])) {
                    $result['exception'] = $productos->getFileError();
                } elseif (!$productos->setEstado(1)) {
                    $result['exception'] = 'Estado inválido';
                } elseif ($productos->createRow()) {
                    $result['status'] = 1;
                    if ($productos->saveFile($_FILES['archivo'], $productos->getRuta(), $productos->getImagen())) {
                        
                        if (!$productos->insertStock($productos->getLastId())) {
                            $result['exception'] = 'Ocurrió un error al insertar el stock';
                        } else {
                            $result['message'] = 'Producto creado correctamente';
                        }
                    } else {
                        $result['message'] = 'Producto creado pero no se guardó la imagen';
                    }
                } else {
                    $result['exception'] = Database::getException();
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
            case 'update':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $productos->validateForm($_POST);
                if (!$productos->setId($_POST['id'])) {
                    $result['exception'] = 'Producto incorrecto';
                } elseif (!$data = $productos->readOne()) {
                    $result['exception'] = 'Producto inexistente';
                }elseif (!$productos->setNombre($_POST['nombre'])) {
                    $result['exception'] = 'Nombre inválido';
                }  elseif (!$productos->setDescripcion($_POST['descripcion'])) {
                    $result['exception'] = 'Descripción inválida';
                } elseif (!$productos->setSubcategoria($_POST['subcategoria'])){
                    $result['exception'] = 'Subcategoría inválida';
                } elseif (!$productos->setProveedor($_POST['proveedor'])){
                    $result['exception'] = 'Proveedor inválido';
                } elseif (!$productos->setMarca($_POST['marca'])){
                    $result['exception'] = 'marca inválida';
                } elseif (!$productos->setPrecio($_POST['precio'])){
                    $result['exception'] = 'Precio inválido';
                } elseif (!$productos->setColor($_POST['color'])){
                    $result['exception'] = 'Color inválido';
                }elseif (!$productos->setDescuento($_POST['descuento'])){
                    $result['exception'] = 'Descuento inválido';
                }elseif (!$productos->setStock($_POST['stock'])){
                    $result['exception'] = 'Stock inválido';
                }elseif (!$productos->setEstado($_POST['estado'])) {
                    $result['exception'] = 'Estado inválido';
                } elseif (!$productos->updateStock()) {
                    $result['exception'] = 'Ocurrió un error al actualizar el stock';
                } elseif (!is_uploaded_file($_FILES['archivo']['tmp_name'])) {
                    if ($productos->updateRow($data['imagenPrincipal'])) {
                        $result['status'] = 1;
                        $result['message'] = 'Producto modificado correctamente';
                    } else {
                        $result['exception'] = Database::getException();
                    }
                } elseif (!$productos->setImagen($_FILES['archivo'])) {
                    $result['exception'] = $subcategorias->getFileError();
                } elseif ($productos->updateRow($data['imagenPrincipal'])) {
                    $result['status'] = 1;
                    if ($productos->saveFile($_FILES['archivo'], $productos->getRuta(), $productos->getImagen())) {
                    } else {
                        $result['message'] = 'Producto actualizado pero no se guardó la imagen';
                    }
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'delete':
                if (!$productos->setId($_POST['id-delete'])) {
                    $result['exception'] = 'Producto incorrecto';
                } elseif (!$productos->readOne()) {
                    $result['exception'] = 'Producto inexistente';
                } elseif ($productos->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto inhabilitado correctamente';
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