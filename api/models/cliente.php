<?php
/*
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class Cliente extends Validator
{
    // Declaración de atributos (propiedades) según nuestra tabla en la base de datos.
    private $id = null;
    private $nombres = null;
    private $apellidos = null;
    private $dui = null;
    private $direccion = null;
    private $telefono = null;
    private $nacimiento = null;
    private $estado = null;
    private $correo = null;
    private $alias = null;
    private $clave = null;
    private $foto = null;

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

    public function setDui($value)
    {
        if ($this->validateDUI($value)) {
            $this->dui = $value;
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

    public function setNacimiento($value)
    {
        if ($this->validateDate($value)) {
            $this->nacimiento = $value;
            return true;
        } else {
            return false;
        }
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

    public function getDui()
    {
        return $this->dui;
    }

    public function getDireccion()
    {
        return $this->direccion;
    }

    public function getTelefono()
    {
        return $this->telefono;
    }

    public function getNacimiento()
    {
        return $this->nacimiento;
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
    



    public function checkUser($correo)
    {
        $sql = 'SELECT "idCliente", "estadoCliente" FROM cliente WHERE "correoCliente" = ? or "aliasCliente" = ?';
        $params = array($correo, $correo);
        if ($data = Database::getRow($sql, $params)) {
            $this->id = $data['idCliente'];
            $this->estado = $data['estadoCliente'];
            $this->correo = $correo;
            return true;
        } else {
            return false;
        }
    }

    public function checkPassword($password)
    {
        $sql = 'SELECT "contrasenaCliente" FROM cliente WHERE "idCliente" = ?';
        $params = array($this->id);
        $data = Database::getRow($sql, $params);
        if (password_verify($password, $data['contrasenaCliente'])) {
            return true;
        } else {
            return false;
        }
    }

    public function changePassword()
    {
        $sql = 'UPDATE cliente SET claveCliente = ? WHERE idCliente = ?';
        $params = array($this->clave, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function editProfile()
    {
        $sql = 'UPDATE cliente
                "nombresCliente"=?, "apellidosCliente"=?, "duiCliente"=?, "correoCliente"=?, "telefonoCliente"=?, "nacimientoCliente"=?, "direccionCliente"=?, "estadoCliente"=?, avatar = ?
                WHERE idCliente = ?';
        $params = array($this->nombres, $this->apellidos, $this->dui, $this->correo, $this->telefono, $this->nacimiento, $this->direccion, $this->estado, $this->foto, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function changeStatus()
    {
        $sql = 'UPDATE cliente
                SET estadoCliente = ?
                WHERE idCliente = ?';
        $params = array($this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }
    
    /* 
    *   Método para comprobar que existen usuarios registrados en nuestra base de datos
    */
    public function readAll()
    {
        $sql = 'SELECT "idCliente", "nombresCliente", "apellidosCliente", "correoCliente", "duiCliente", ec."estadoCliente"
        FROM cliente as c inner join "estadoCliente" as ec on c."estadoCliente" = ec."idEstadoCliente"
        ORDER BY "idCliente"';
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT "idCliente", "nombresCliente", "apellidosCliente", "correoCliente", "duiCliente", "telefonoCliente", "nacimientoCliente", "aliasCliente", "direccionCliente", "estadoCliente", avatar
        FROM cliente
        WHERE "idCliente" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /* Método para obtener un empleado y mostrarlo en modal de visualizar*/
    public function readOneShow()
    {
        $sql = 'SELECT "idCliente", "nombresCliente", "apellidosCliente", "duiCliente", "correoCliente", "telefonoCliente", "nacimientoCliente", "direccionCliente", ec."estadoCliente", a.avatar, "aliasCliente"
        FROM cliente as c inner join "estadoCliente" as ec on c."estadoCliente" = ec."idEstadoCliente"
		inner join "avatar" as a on c."avatar" = a."idAvatar" 
        WHERE "idCliente" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Método para leer toda la información de la tabla avatar-------------------------.
    public function readAvatar()
    {
        $sql = 'Select "idAvatar", "avatar" from "avatar"';
        $params = null;
        return Database::getRows($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT "idCliente", "nombresCliente", "apellidosCliente", "correoCliente", "duiCliente", ec."estadoCliente"
        FROM cliente as c inner join "estadoCliente" as ec on c."estadoCliente" = ec."idEstadoCliente"
        WHERE "nombresCliente" ILIKE ? OR "apellidosCliente" ILIKE ?
        order by "idCliente"';
        $params = array("%$value%", "%$value%");
        return Database::getRows($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO cliente(
            "nombresCliente", "apellidosCliente", "duiCliente", "correoCliente", "telefonoCliente", "nacimientoCliente", "direccionCliente", "contrasenaCliente", "estadoCliente", "aliasCliente", avatar)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->nombres, $this->apellidos, $this->dui, $this->correo, $this->telefono, $this->nacimiento, $this->direccion,  $this->clave,  $this->estado, $this->alias, $this->foto);
        return Database::executeRow($sql, $params);
    }


    /* UPDATE */
    public function updateRow()
    {
        $sql = 'UPDATE cliente
            SET "nombresCliente"=?, "apellidosCliente"=?, "duiCliente"=?, "correoCliente"=?, "telefonoCliente"=?, "nacimientoCliente"=?, "direccionCliente"=?, "estadoCliente"=?, avatar = ?
            WHERE "idCliente"=?;';
            $params = array($this->nombres, $this->apellidos, $this->dui, $this->correo, $this->telefono, $this->nacimiento, $this->direccion, $this->estado, $this->foto, $_SESSION['idCliente']);
        return Database::executeRow($sql, $params);
    }

    /* DELETE */
    /* Función para inhabilitar un usuario ya que no los borraremos de la base*/
    public function deleteRow()
    {
        //No eliminaremos registros, solo los inhabilitaremos
        $sql = 'UPDATE cliente SET "estadoCliente" = 3 WHERE "idCliente" = ?'; 
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}