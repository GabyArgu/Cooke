<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class Usuarios extends Validator
{
    // Declaración de atributos (propiedades) según nuestra tabla en la base de datos.
    private $id = null;
    private $nombres = null;
    private $apellidos = null;
    private $cargo = null;
    private $direccion = null;
    private $telefono = null;
    private $foto = null;
    private $estado = null;
    private $correo = null;
    private $alias = null;
    private $clave = null;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */
    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setNombres($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->nombres = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setApellidos($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->apellidos = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setCargo($value)
    {
        $this->cargo = $value;
        return true;
    }

    public function setDireccion($value)
    {   
        if($this->validateAlphabetic($value, 1, 200)){
            $this->direccion = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setTelefono($value)
    {   
        if ($this->validatePhone($value)) {
            $this->telefono = $value;
            return true;
        } else {
            return false;
        }
        
    }

    public function setCorreo($value)
    {
        if ($this->validateEmail($value)) {
            $this->correo = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setAlias($value)
    {
        if ($this->validateAlphanumeric($value, 1, 50)) {
            $this->alias = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setClave($value)
    {
        if ($this->validatePassword($value)) {
            $this->clave = password_hash($value, PASSWORD_DEFAULT);
            return true;
        } else {
            return false;
        }
    }

    public function setFoto($value)
    {
        $this->foto = $value;
        return true;
    }

    public function setEstado($value)
    {
        $this->estado = $value;
        return true;
    }
    /*
    *   Métodos para obtener valores de los atributos.
    */
    public function getId()
    {
        return $this->id;
    }

    public function getNombres()
    {
        return $this->nombres;
    }

    public function getApellidos()
    {
        return $this->apellidos;
    }

    public function getCargo()
    {
        return $this->cargo;
    }

    public function getDireccion()
    {
        return $this->direccion;
    }

    public function getTelefono()
    {
        return $this->telefono;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    public function getCorreo()
    {
        return $this->correo;
    }

    public function getAlias()
    {
        return $this->alias;
    }

    public function getClave()
    {
        return $this->clave;
    }
    public function getFoto()
    {
        return $this->foto;
    }

    /*
    *   Métodos para gestionar la cuenta del usuario.
    */
    public function checkUser($alias)
    {
        $sql = 'SELECT "idEmpleado" FROM empleado WHERE "aliasEmpleado" = ?';
        $params = array($alias);
        if ($data = Database::getRow($sql, $params)) {
            $this->id = $data['idEmpleado'];
            $this->alias = $alias;
            return true;
        } else {
            return false;
        }
    }

    public function checkPassword($password)
    {
        $sql = 'SELECT "contrasenaEmpleado" FROM empleado WHERE "idEmpleado" = ?';
        $params = array($this->id);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['contrasenaEmpleado'])) {
            return true;
        } else {
            return false;
        }
    }

    public function createRow()
    {
        $sql = 'INSERT INTO empleado("nombresEmpleado", "apellidosEmpleado", "correoEmpleado", "aliasEmpleado", "contrasenaEmpleado", "direccionEmpleado", "telefonoEmpleado", "fotoEmpleado", "cargoEmpleado", "estadoEmpleado")
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
        $params = array($this->nombres, $this->apellidos, $this->correo, $this->alias, $this->clave, $this->direccion, $this->telefono, $this->foto, $this->cargo, $this->estado);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT "idEmpleado", "nombresEmpleado", "apellidosEmpleado", "correoEmpleado", "aliasEmpleado"  
                FROM empleado
                ORDER BY "apellidosEmpleado"';
        $params = null;
        return Database::getRows($sql, $params);
    }

}