<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/categorias_productos.php');
require_once('../models/subcategoriapd.php');
require_once('../models/productos.php');
require_once('../models/colores.php');
require_once('../models/resenas.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancian las clases correspondientes.
    $categoria = new CategoriaCP;
    $producto = new Productos;
    $subcategoria = new Subcategoriapd;
    $colores = new ColorProducto;
    $resena = new Reseñas;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'exception' => null);
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
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
            case 'search':
                    if (!$producto->setId($_POST['idSubcategoria'])) {
                    $result['exception'] = 'Subcategoría incorrecta';
                    } elseif ($result['dataset'] = $producto->searchRowsPublic($_POST['search'])) {
                        $result['status'] = 1;
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    }else {
                        $result['exception'] = 'No hay coincidencias';
                    }
                    break;
            case 'filterPrecio':
                    if (!$producto->setId($_POST['idSubcategoria2'])) {
                    $result['exception'] = 'Subcategoría incorrecta';
                    } elseif ($result['dataset'] = $producto->filterPrecio($_POST['precio-min'], $_POST['precio-max'])) {
                        $result['status'] = 1;
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    }else {
                        $result['exception'] = 'No hay coincidencias';
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
            case 'readStock':
                if (!$producto->setId($_POST['idProducto'])) {
                    $result['exception'] = 'Producto incorrecto';
                } elseif (!$producto->setColor($_POST['idColor'])) {
                    $result['exception'] = 'Color incorrecto';
                } elseif ($result['dataset'] = $producto->readProductStock()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Stock del producto inexistente';
                }
                break;
            case 'readColor':
                if (!$colores->setId($_POST['idProducto'])) {
                    $result['exception'] = 'Producto incorrecto';
                } elseif ($result['dataset'] = $colores->readColorProducto()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'productReview':
                if (!$resena->setId($_POST['idProducto'])) {
                    $result['exception'] = 'Producto incorrecto';
                } elseif ($result['dataset'] = $resena->productReview($_POST['idProducto'])) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay existen reseñas de este producto. ¡Anímate a ser el primero en comentar!';
                }
                break;
            case 'puntajeReview':
                if (!$resena->setId($_POST['idProducto'])) {
                    $result['exception'] = 'Producto incorrecto';
                } elseif ($result['dataset'] = $resena->puntajeReview($_POST['idProducto'])) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Producto sin puntaje';
                }
                break;
            case 'doReview':
                if(isset($_SESSION['idCliente'])){
                    if (!$resena->setId($_POST['idProductoResena'])) {
                        $result['exception'] = 'Producto incorrecto';
                    } elseif(!$resena->setTitulo($_POST['titulo'])) {
                        $result['exception'] = 'Titulo incorrecto';
                    } elseif(!$resena->setDescripcion($_POST['comentario'])) {
                        $result['exception'] = 'Comentario incorrecto';
                    } elseif(!$resena->setPuntaje($_POST['puntaje'])) {
                        $result['exception'] = 'Puntaje incorrecto';
                    }elseif ($resena->doReview()) {
                        $result['status'] = 1;
                        $result['message'] = 'Reseña públicada correctamente';
                    } else {
                        $result['exception'] = 'Debe de comprar el producto para realizar reseñas de este';
                    }
                }
                else{
                    switch ($_GET['action']) {
                        default:
                            $result['exception'] = 'Debe iniciar sesión para realizar una reseña';
                    }
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


if(isset($_SESSION['idCliente'])){

}
else{
    switch ($_GET['action']) {
        case 'createDetail':
            $result['exception'] = 'Debe iniciar sesión para agregar el producto al carrito';
            break;
        case 'checkProduct':
            $result['exception'] = 'Debe iniciar sesión para agregar el producto al carrito';
            break;
        default:
            $result['exception'] = 'Acción no disponible fuera de la sesión';
    }
}