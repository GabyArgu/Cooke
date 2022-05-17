<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/cliente.php');

// Se comprueba si existe una acción a realizar por medio de isset, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $cliente = new Cliente;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $cliente->readAll()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'search':
                if ($result['dataset'] = $cliente->searchRows($_POST['search'])) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                }else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            case 'create':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $cliente->validateForm($_POST);
                if (!$cliente->setNombres($_POST['nombres'])) {
                    $result['exception'] = 'Nombres inválidos';
                } elseif (!$cliente->setApellidos($_POST['apellidos'])) {
                    $result['exception'] = 'Apellidos inválidos';
                } elseif (!$cliente->setDui($_POST['dui'])){
                    $result['exception'] = 'Dui inválido';
                } elseif (!$cliente->setCorreo($_POST['correo'])) {
                    $result['exception'] = 'Correo inválido';
                } elseif (!$cliente->setDireccion($_POST['direccion'])) {
                    $result['exception'] = 'Direccion inválida';
                } elseif (!$cliente->setTelefono($_POST['telefono'])) {
                    $result['exception'] = 'Teléfono inválido';
                }elseif (!$cliente->setNacimiento($_POST['nacimiento'])) {
                    $result['exception'] = 'Fecha inválida';
                }elseif (!$cliente->setEstado(1)) {
                    $result['exception'] = 'Estado inválido';
                }elseif (!$cliente->setAlias($_POST['alias'])) {
                    $result['exception'] = 'Alias inválido';
                } elseif (!$cliente->setClave($_POST['clave'])) {
                    $result['exception'] = 'Clave inválida';
                } elseif ($cliente->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cliente creado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'readOne':
                if (!$cliente->setId($_POST['id'])) {
                    $result['exception'] = 'Cliente incorrecto';
                } elseif ($result['dataset'] = $cliente->readOne()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Cliente inexistente';
                }
                break;
                case 'readOneShow':
                        if (!$cliente->setId($_POST['id'])) {
                            $result['exception'] = 'Cliente incorrecto';
                        } elseif ($result['dataset'] = $cliente->readOneShow()) {
                            $result['status'] = 1;
                        } elseif (Database::getException()) {
                            $result['exception'] = Database::getException();
                        } else {
                            $result['exception'] = 'Cliente inexistente';
                        }
                        break;
                case 'update':
                    //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                    $_POST = $cliente->validateForm($_POST);
                    if (!$cliente->setId($_POST['id'])) {
                        $result['exception'] = 'Cliente incorrecto';
                    } elseif (!$data = $cliente->readOne()) {
                        $result['exception'] = 'Cliente inexistente';
                    } if (!$cliente->setNombres($_POST['nombres'])) {
                        $result['exception'] = 'Nombres inválidos';
                    } elseif (!$cliente->setApellidos($_POST['apellidos'])) {
                        $result['exception'] = 'Apellidos inválidos';
                    } elseif (!$cliente->setDui($_POST['dui'])){
                        $result['exception'] = 'Dui inválido';
                    } elseif (!$cliente->setCorreo($_POST['correo'])) {
                        $result['exception'] = 'Correo inválido';
                    } elseif (!$cliente->setDireccion($_POST['direccion'])) {
                        $result['exception'] = 'Direccion inválida';
                    } elseif (!$cliente->setTelefono($_POST['telefono'])) {
                        $result['exception'] = 'Teléfono inválido';
                    }elseif (!$cliente->setNacimiento($_POST['nacimiento'])) {
                        $result['exception'] = 'Fecha inválida';
                    }elseif (!$cliente->setEstado($_POST['estado'])) {
                        $result['exception'] = 'Estado inválido';
                    }elseif ($cliente->updateRow()) {
                        $result['status'] = 1;
                        $result['message'] = 'Cliente modificado correctamente';
                    } else {
                        $result['exception'] = Database::getException();
                    }
                    break;
                case 'delete':
                if (!$cliente->setId($_POST['id-delete'])) {
                    $result['exception'] = 'Cliente incorrecto';
                } elseif (!$cliente->readOne()) {
                    $result['exception'] = 'Cliente inexistente';
                } elseif ($cliente->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cliente inhabilitado correctamente';
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