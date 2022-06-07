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
    $result = array('status' => 0, 'session' => 0, 'recaptcha' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null, 'avatar' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idCliente'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Accion de leer la información en base al alias ------------------.
            case 'getUser':
                if (isset($_SESSION['correoCliente'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['correoCliente'];
                } else {
                    $result['exception'] = 'Correo de cliente indefinido';
                }
                break;
            // Accion de cerrar sesión------------------.        
            case 'logOut':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['exception'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
            case 'readOne':
                if (!$cliente->setId($_SESSION['idCliente'])) {
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
                if (!$cliente->setId($_SESSION['idCliente'])) {
                    $result['exception'] = 'Cliente incorrecto';
                } elseif ($result['dataset'] = $cliente->readOneShow()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Cliente inexistente';
                }
                break;
            case 'readAvatar':
                if ($result['dataset'] = $cliente->readAvatar()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
                break;
            case 'update':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $cliente->validateForm($_POST);
                if (!$cliente->setId($_SESSION['idCliente'])) {
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
                }elseif (!$cliente->setFoto($_POST['foto'])) {
                    $result['exception'] = 'Foto inválida';
                }elseif (!$cliente->setEstado(1)) {
                    $result['exception'] = 'Estado inválido';
                }elseif ($cliente->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cliente modificado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            default:
                $result['exception'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el administrador no ha iniciado sesión.
        switch ($_GET['action']) {
            case 'register':
                $_POST = $cliente->validateForm($_POST);
                $secretKey = '6LdBzLQUAAAAAL6oP4xpgMao-SmEkmRCpoLBLri-';
                $ip = $_SERVER['REMOTE_ADDR'];

                $data = array('secret' => $secretKey, 'response' => $_POST['g-recaptcha-response'],'remoteip' => $ip);

                $options = array(
                    'http' => array('header'  => "Content-type: application/x-www-form-urlencoded\r\n", 'method' => 'POST', 'content' => http_build_query($data)),
                    'ssl' => array('verify_peer' => false, 'verify_peer_name' => false)
                );

                $url = 'https://www.google.com/recaptcha/api/siteverify';
                $context  = stream_context_create($options);
                $response = file_get_contents($url, false, $context);
                $captcha = json_decode($response, true);

                if (!$captcha['success']) {
                    $result['recaptcha'] = 1;
                    $result['exception'] = 'No eres un humano';
                }
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $cliente->validateForm($_POST);
                if (!$cliente->setNombres($_POST['nombres'])) {
                    $result['exception'] = 'Nombres inválidos';
                } elseif (!$cliente->setApellidos($_POST['apellidos'])) {
                    $result['exception'] = 'Apellidos inválidos';
                } elseif (!$cliente->setDui($_POST['dui'])) {
                    $result['exception'] = 'Dui inválido';
                } elseif (!$cliente->setCorreo($_POST['correo'])) {
                    $result['exception'] = 'Correo inválido';
                } elseif (!$cliente->setDireccion($_POST['direccion'])) {
                    $result['exception'] = 'Direccion inválida';
                } elseif (!$cliente->setTelefono($_POST['telefono'])) {
                    $result['exception'] = 'Teléfono inválido';
                }elseif (!$cliente->setNacimiento($_POST['nacimiento'])) {
                    $result['exception'] = 'Fecha inválida';
                }elseif (!$cliente->setFoto(1)) {
                    $result['exception'] = 'Foto inválida';
                }elseif (!$cliente->setEstado(1)) {
                    $result['exception'] = 'Estado inválido';
                }elseif (!$cliente->setAlias($_POST['alias'])) {
                    $result['exception'] = 'Alias inválido';
                }elseif ($_POST['clave'] != $_POST['confirmar']) {
                    $result['exception'] = 'Claves diferentes';
                }elseif (!$cliente->setClave($_POST['clave'])) {
                    $result['exception'] = $cliente->getPasswordError();
                } elseif ($cliente->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cliente registrado correctamente';
                } else {
                    $result['exception'] = Database::getException();
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
                }elseif (!$cliente->setFoto($_POST['foto'])) {
                        $result['exception'] = 'Foto inválida';
                }elseif (!$cliente->setEstado($_POST['estado'])) {
                        $result['exception'] = 'Estado inválido';
                }elseif ($cliente->updateRow()) {
                        $result['status'] = 1;
                        $result['message'] = 'Cliente modificado correctamente';
                } else {
                        $result['exception'] = Database::getException();
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
                         
            case 'logIn':
                $_POST = $cliente->validateForm($_POST);
                if (!$cliente->checkUser($_POST['correo'])) {
                    $result['exception'] = 'Correo incorrecto';
                } elseif (!$cliente->getEstado()) {
                    $result['exception'] = 'La cuenta ha sido desactivada';
                } elseif ($cliente->checkPassword($_POST['clave'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Autenticación correcta';
                    $_SESSION['idCliente'] = $cliente->getId();
                    $_SESSION['correoCliente'] = $cliente->getCorreo();
                } else {
                    $result['exception'] = 'Clave incorrecta';
                }
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
