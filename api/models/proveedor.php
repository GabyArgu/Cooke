<?php
/*
*	Clase para manejar la tabla categorias de la base de datos.
*   Es clase hija de Validator.
*/
class Proveedor extends Validator
{
    // Declaración de atributos (propiedades).
    private $id = null;
    private $proveedor = null;
    private $direccion = null;
    private $telefono = null;
    private $estado = null;
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

    public function setProveedor($value)
    {
        if ($this->validateAlphanumeric($value, 1, 50)) {
            $this->proveedor = $value;
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

    public function getProveedor()
    {
        return $this->proveedor;
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

    public function readAll()
    {
        $sql = 'SELECT "idProveedor", "nombreProveedor", e.estado FROM proveedor p INNER JOIN estado as e on p.estado = e."idEstado" order by "idProveedor"';
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT "idProveedor", "nombreProveedor", "telefonoProveedor", "direccionProveedor", estado FROM proveedor WHERE "idProveedor" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readOneShow()
    {
        $sql = 'SELECT "nombreProveedor", "telefonoProveedor", "direccionProveedor", e.estado FROM proveedor p INNER JOIN estado as e on p.estado = e."idEstado" 
		WHERE "idProveedor" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT "idProveedor", "nombreProveedor", "direccionProveedor", "telefonoProveedor", e.estado FROM proveedor p INNER JOIN estado as e on p.estado = e."idEstado" 
        WHERE "nombreProveedor" ILIKE ?
		ORDER BY "idProveedor"';
        $params = array("%$value%");
        return Database::getRows($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO proveedor(
            "nombreProveedor", "direccionProveedor", "telefonoProveedor", estado)
            VALUES (?, ?, ?, ?);';
        $params = array($this->proveedor, $this->direccion, $this->telefono, $this->estado);
        return Database::executeRow($sql, $params);
    }

    /* UPDATE */
    public function updateRow()
    {   
        $sql = 'UPDATE proveedor
        SET "nombreProveedor"=?, "direccionProveedor"=?, "telefonoProveedor"=?, estado=?
        WHERE "idProveedor"=?;';
            $params = array($this->proveedor, $this->direccion, $this->telefono, $this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    /* DELETE */
    /* Función para inhabilitar un usuario ya que no los borraremos de la base*/
    public function deleteRow()
    {
        //No eliminaremos registros, solo los inhabilitaremos
        $sql = 'UPDATE proveedor SET estado = 3 WHERE "idProveedor" = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}