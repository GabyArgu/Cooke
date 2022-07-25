<?php
/*
*	Esta sera la clase para manejar la tabla usuarios de la base de datos.
*   Es una clase hija de Validator.
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
        if ($this->validateNaturalNumber($value)) {
            $this->cargo = $value;
            return true;
        } else {
            return false;
        }
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
        if ($this->validateNaturalNumber($value)) {
            $this->estado = $value;
            return true;
        } else {
            return false;
        }
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
    *   Métodos para gestionar la cuenta de la tabla usuario.
    */

    // Se verifica si hay concidencias de información mediante el alias del empleado ingresado-------------------------.

    public function checkUser($alias)
    {
        $sql = 'SELECT "idEmpleado", a.avatar, ce."cargoEmpleado"
        FROM empleado as e inner join "cargoEmpleado" as ce on e."cargoEmpleado" = ce."idCargoEmpleado"
		inner join "avatar" as a on e."fotoEmpleado" = a."idAvatar" 
        WHERE "aliasEmpleado" = ?';
        $params = array($alias);
        if ($data = Database::getRow($sql, $params)) {
            $this->id = $data['idEmpleado'];
            $this->alias = $alias;
            $this->foto = $data['avatar'];
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

    /* 
    *   Método para comprobar que existen usuarios registrados en nuestra base de datos
    */

    // Método para leer toda la información de los usuarios registrados-------------------------.
    public function readAll()
    {
        $sql = 'SELECT "idEmpleado", "nombresEmpleado", "apellidosEmpleado", "telefonoEmpleado", ce."cargoEmpleado", ee."estadoEmpleado"
        FROM empleado as e inner join "cargoEmpleado" as ce on e."cargoEmpleado" = ce."idCargoEmpleado"
        inner join "estadoEmpleado" as ee on e."estadoEmpleado" = ee."idEstadoEmpleado" 
		order by "idEmpleado", e."estadoEmpleado"';
        
        $params = null;
        return Database::getRows($sql, $params);
    }

    // Método para un dato en especifico de los usuarios registrados-------------------------.
    public function readOne()
    {
        $sql = 'SELECT "idEmpleado", "nombresEmpleado", "apellidosEmpleado", "correoEmpleado", "telefonoEmpleado", "direccionEmpleado", "aliasEmpleado", "fotoEmpleado", "cargoEmpleado", "estadoEmpleado"
        FROM empleado
        where "idEmpleado" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /* Método para obtener un empleado y mostrarlo en modal de visualizar*/
    public function readOneShow()
    {
        $sql = 'SELECT "idEmpleado", "nombresEmpleado", "apellidosEmpleado", "correoEmpleado", "telefonoEmpleado", "direccionEmpleado", "aliasEmpleado", a.avatar, ce."cargoEmpleado", ee."estadoEmpleado"
        FROM empleado as e inner join "cargoEmpleado" as ce on e."cargoEmpleado" = ce."idCargoEmpleado"
        inner join "estadoEmpleado" as ee on e."estadoEmpleado" = ee."idEstadoEmpleado"
		inner join "avatar" as a on e."fotoEmpleado" = a."idAvatar" 
        where "idEmpleado" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }
    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT "idEmpleado", "nombresEmpleado", "apellidosEmpleado", "telefonoEmpleado", ce."cargoEmpleado", ee."estadoEmpleado"
                FROM empleado as e inner join "cargoEmpleado" as ce on e."cargoEmpleado" = ce."idCargoEmpleado"
                inner join "estadoEmpleado" as ee on e."estadoEmpleado" = ee."idEstadoEmpleado"
                WHERE "nombresEmpleado" ILIKE ? OR "apellidosEmpleado" ILIKE ?
                order by "idEmpleado", e."estadoEmpleado"';
        $params = array("%$value%", "%$value%");
        return Database::getRows($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO empleado("nombresEmpleado", "apellidosEmpleado", "correoEmpleado", "aliasEmpleado", "contrasenaEmpleado", "direccionEmpleado", "telefonoEmpleado", "fotoEmpleado", "cargoEmpleado", "estadoEmpleado")
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
        $params = array($this->nombres, $this->apellidos, $this->correo, $this->alias, $this->clave, $this->direccion, $this->telefono, $this->foto, $this->cargo, $this->estado);
        return Database::executeRow($sql, $params);
    }


    /* UPDATE */
    public function updateRow()
    {
        $sql = 'UPDATE empleado
                SET "nombresEmpleado" = ?, "apellidosEmpleado" = ?, "correoEmpleado" = ?, "direccionEmpleado" = ?, "telefonoEmpleado" = ?, "cargoEmpleado" = ?, "estadoEmpleado" = ?, "fotoEmpleado" = ?
                WHERE "idEmpleado" = ?';
            $params = array($this->nombres, $this->apellidos, $this->correo, $this->direccion, $this->telefono, $this->cargo, $this->estado, $this->foto, $this->id);
        return Database::executeRow($sql, $params);
    }

    /* DELETE */
    /* Función para inhabilitar un usuario ya que no los borraremos de la base------------------------- */
    public function deleteRow()
    {
        //No eliminaremos registros, solo los inhabilitaremos-------------------------.
        $sql = 'UPDATE empleado SET "estadoEmpleado" = 3 WHERE "idEmpleado" = ?'; //Delete from empleado where "idEmpleado" = ? -------------------------.
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    /*
        Método para generar reporte de empleados por cargo
    */ 

    public function empleadosCargo()
    {
        $sql = 'SELECT "nombresEmpleado", "apellidosEmpleado", "correoEmpleado", "telefonoEmpleado", ep."estadoEmpleado"
                FROM empleado INNER JOIN "cargoEmpleado" on "empleado"."cargoEmpleado" = "cargoEmpleado"."idCargoEmpleado"
                INNER JOIN "estadoEmpleado" as ep on "empleado"."estadoEmpleado" = ep."idEstadoEmpleado"
                WHERE "idCargoEmpleado" = ?
                ORDER BY "nombresEmpleado"';
        $params = array($this->cargo);
        return Database::getRows($sql, $params);
    }
}