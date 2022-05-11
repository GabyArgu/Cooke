<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/usuarios.php');

// Se comprueba si existe una acción a realizar por medio de isset, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $usuario = new Usuarios;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['id_usuario'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'getUser':
                if (isset($_SESSION['alias_usuario'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['alias_usuario'];
                } else {
                    $result['exception'] = 'Alias de usuario indefinido';
                }
                break;
            case 'logOut':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['exception'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $usuario->readAll()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'search':
                if ($result['dataset'] = $usuario->searchRows($_POST['search'])) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                }else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            case 'create':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $usuario->validateForm($_POST);
                if (!$usuario->setNombres($_POST['nombres'])) {
                    $result['exception'] = 'Nombres inválidos';
                } elseif (!$usuario->setApellidos($_POST['apellidos'])) {
                    $result['exception'] = 'Apellidos inválidos';
                } elseif (!$usuario->setCargo($_POST['cargo'])){
                    $result['exception'] = 'Cargo inválido';
                } elseif (!$usuario->setCorreo($_POST['correo'])) {
                    $result['exception'] = 'Correo inválido';
                } elseif (!$usuario->setDireccion($_POST['direccion'])) {
                    $result['exception'] = 'Direccion inválida';
                } elseif (!$usuario->setTelefono($_POST['telefono'])) {
                    $result['exception'] = 'Teléfono inválido';
                }elseif (!$usuario->setFoto($_POST['foto'])) {
                    $result['exception'] = 'Foto inválida';
                }elseif (!$usuario->setEstado(1)) {
                    $result['exception'] = 'Estado inválido';
                }elseif (!$usuario->setAlias($_POST['alias'])) {
                    $result['exception'] = 'Alias inválido';
                } elseif ($_POST['clave'] != $_POST['confirmar']) {
                    $result['exception'] = 'Claves diferentes';
                } elseif (!$usuario->setClave($_POST['clave'])) {
                    $result['exception'] = $usuario->getPasswordError();
                } elseif ($usuario->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Empleado creado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'readOne':
                if (!$usuario->setId($_POST['id'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif ($result['dataset'] = $usuario->readOne()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Empleado inexistente';
                }
                break;
            case 'update':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $usuario->validateForm($_POST);
                if (!$usuario->setId($_POST['id'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif (!$usuario->readOne()) {
                    $result['exception'] = 'Empleado inexistente';
                } if (!$usuario->setNombres($_POST['nombres'])) {
                    $result['exception'] = 'Nombres inválidos';
                } elseif (!$usuario->setApellidos($_POST['apellidos'])) {
                    $result['exception'] = 'Apellidos inválidos';
                } elseif (!$usuario->setCargo($_POST['cargo'])){
                    $result['exception'] = 'Cargo inválido';
                } elseif (!$usuario->setCorreo($_POST['correo'])) {
                    $result['exception'] = 'Correo inválido';
                } elseif (!$usuario->setDireccion($_POST['direccion'])) {
                    $result['exception'] = 'Direccion inválida';
                } elseif (!$usuario->setTelefono($_POST['telefono'])) {
                    $result['exception'] = 'Teléfono inválido';
                }elseif (!$usuario->setFoto($_POST['foto'])) {
                    $result['exception'] = 'Foto inválida';
                }elseif (!$usuario->setEstado($_POST['estado'])) {
                    $result['exception'] = 'Estado inválido';
                }elseif ($usuario->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Empleado modificado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'delete':
                if ($_POST['idEmpleado'] == $_SESSION['id_usuario']) {
                    $result['exception'] = 'No se puede dar de baja a sí mismo';
                } elseif (!$usuario->setId($_POST['idEmpleado'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif (!$usuario->readOne()) {
                    $result['exception'] = 'Empleado inexistente';
                } elseif ($usuario->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Empleado inhabilitado correctamente';
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
            case 'readUsers':
                //Verificamos si existen usuarios registrados en la base de datos, para que en caso de no, registrar el primer usuario
                if ($usuario->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existe al menos un usuario registrado';
                } else {
                    $result['exception'] = 'No existen usuarios registrados';
                }
                break;
            case 'register-first-user':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $usuario->validateForm($_POST);
                if (!$usuario->setNombres($_POST['nombres'])) {
                    $result['exception'] = 'Nombres inválidos';
                } elseif (!$usuario->setApellidos($_POST['apellidos'])) {
                    $result['exception'] = 'Apellidos inválidos';
                } elseif (!$usuario->setCargo(1)){
                    $result['exception'] = 'Cargo inválido';
                } elseif (!$usuario->setCorreo($_POST['correo'])) {
                    $result['exception'] = 'Correo inválido';
                } elseif (!$usuario->setDireccion($_POST['direccion'])) {
                    $result['exception'] = 'Direccion inválida';
                } elseif (!$usuario->setTelefono($_POST['telefono'])) {
                    $result['exception'] = 'Teléfono inválido';
                }elseif (!$usuario->setFoto(1)) {
                    $result['exception'] = 'Foto inválida';
                }elseif (!$usuario->setEstado(1)) {
                    $result['exception'] = 'Estado inválido';
                }elseif (!$usuario->setAlias($_POST['alias'])) {
                    $result['exception'] = 'Alias inválido';
                } elseif ($_POST['clave'] != $_POST['confirmar']) {
                    $result['exception'] = 'Claves diferentes';
                } elseif (!$usuario->setClave($_POST['clave'])) {
                    $result['exception'] = $usuario->getPasswordError();
                } elseif ($usuario->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Usuario registrado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'logIn':
                $_POST = $usuario->validateForm($_POST);
                if (!$usuario->checkUser($_POST['alias'])) {
                    $result['exception'] = 'Alias incorrecto';
                } elseif ($usuario->checkPassword($_POST['clave'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Autenticación correcta';
                    $_SESSION['id_usuario'] = $usuario->getId();
                    $_SESSION['alias_usuario'] = $usuario->getAlias();
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
