<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/categorias_productos.php');
require_once('../models/subcategoriapd.php');
require_once('../models/productos.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se instancian las clases correspondientes.
    $categoria = new CategoriaCP;
    $producto = new Productos;
    $subcategoria = new Subcategoriapd;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'exception' => null);
    // Se compara la acción a realizar según la petición del controlador.
    switch ($_GET['action']) {
        case 'readAll':
            if ($result['dataset'] = $categoria->readAll()) {
                $result['status'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No existen categorías para mostrar';
            }
            break;
        case 'readSubcategoriasCategoria':
            if (!$subcategoria->setId($_POST['idCategoria'])) {
                $result['exception'] = 'Categoría incorrecta';
            } elseif ($result['dataset'] = $subcategoria->readSubcategoriasCategoria()) {
                $result['status'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No existen subcategorías para mostrar';
            }
            break;
        case 'readProductosSubcategoria':
            if (!$producto->setId($_POST['idSubcategoria'])) {
                $result['exception'] = 'Subcategoría incorrecta';
            } elseif ($result['dataset'] = $producto->readProductosSubcategoria()) {
                $result['status'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No existen productos para mostrar';
            }
            break;
        case 'readOne':
            if (!$producto->setId($_POST['idProducto'])) {
                $result['exception'] = 'Producto incorrecto';
            } elseif ($result['dataset'] = $producto->readOne()) {
                $result['status'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'Producto inexistente';
            }
            break;
        default:
            $result['exception'] = 'Acción no disponible';
    }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
