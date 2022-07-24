<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/pedidos.php');

// Se comprueba si existe una acción a realizar por medio de isset, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $pedido = new Pedidos;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'exception' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idCliente'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'createDetail':
                $_POST = $pedido->validateForm($_POST);
                if (!$pedido->setColor($_POST['color'])) {
                    $result['message'] = 'Color inválido';
                }
                elseif ($pedido->checkProducto($_POST['idProducto'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto en carrito';
                }
                elseif (!$pedido->startOrder()) {
                    $result['exception'] = 'Ocurrió un problema al obtener el pedido';
                } elseif (!$pedido->setProducto($_POST['idProducto'])) {
                    $result['exception'] = 'Producto incorrecto';
                } elseif (!$pedido->setCantidad($_POST['input-stock'])) {
                    $result['exception'] = 'Cantidad incorrecta';
                }   elseif ($pedido->createDetail()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto agregado correctamente';
                } else {
                    $result['exception'] = 'Ocurrió un problema al agregar el producto';
                }
                    break;
            case 'createDetailInicio':
                $_POST = $pedido->validateForm($_POST);
                if (!$pedido->setColor($_POST['idColorStock'])) {
                    $result['message'] = 'Color inválido';
                } elseif ($pedido->checkProductoInicio()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto en carrito';
                } elseif (!$pedido->startOrder()) {
                    $result['exception'] = 'Ocurrió un problema al obtener el pedido';
                } elseif ($pedido->createDetailInicio()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto agregado correctamente';
                } else {
                    $result['exception'] = 'Ocurrió un problema al agregar el producto';
                }
                    break;
            case 'readOrderDetail':
                if (!$pedido->startOrder()) {
                    $result['exception'] = 'Debe agregar un producto al carrito';
                } elseif ($result['dataset'] = $pedido->readOrderDetail()) {
                    $result['status'] = 1;
                    $_SESSION['idPedido'] = $pedido->getIdPedido();
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No tienes productos en el carrito';
                }
                break;
            case 'readStock':
            if (!$pedido->setColor($_POST['idColorStock'])) {
                $result['exception'] = 'Producto incorrecto';
            } elseif ($result['dataset'] = $pedido->readProductStock()) {
                $result['status'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'Stock del producto inexistente';
            }
            break;
            case 'updateDetail':
                $_POST = $pedido->validateForm($_POST);
                if (!$pedido->setIdDetalle($_POST['idDetalle'])) {
                    $result['exception'] = 'Detalle incorrecto';
                } elseif (!$pedido->setCantidad($_POST['input-stock'])) {
                    $result['exception'] = 'Cantidad incorrecta';
                } elseif ($pedido->updateDetail()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cantidad modificada correctamente';
                } else {
                    $result['exception'] = 'Ocurrió un problema al modificar la cantidad';
                }
                break;
            case 'finishOrder':
                if (!$pedido->setTotal($_POST['montoTotal'])) {
                    $result['exception'] = 'Monto incorrecto';
                }elseif ($pedido->finishOrder()) {
                    $result['status'] = 1;
                    $result['message'] = 'Pedido finalizado correctamente';
                }else {
                    $result['exception'] = 'Ocurrió un problema al finalizar el pedido';
                }
                break;
            case 'deleteDetail':
                if (!$pedido->setIdDetalle($_POST['idDetalle'])) {
                    $result['exception'] = 'Detalle incorrecto';
                } elseif ($pedido->deleteDetail()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto removido correctamente';
                } else {
                    $result['exception'] = 'Ocurrió un problema al remover el producto';
                }
                break;
            case 'readPedidosCliente':
                if ($result['dataset'] = $pedido->readPedidosCliente()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Su historial de pedidos está vacío';
                }
                break;
            case 'readOneDPShow':
                if (!$pedido->setId($_POST['id-det'])) {
                    $result['exception'] = 'Pedido incorrecto';
                } elseif ($result['dataset'] = $pedido->readOneDPShow()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Pedido inexistente';
                }
                break;
            default:
                $result['exception'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando un cliente no ha iniciado sesión.
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
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
