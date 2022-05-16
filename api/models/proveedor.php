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


    public function readAll()
    {
        $sql = 'SELECT "idProveedor", "nombreProveedor", e.estado FROM proveedor p INNER JOIN estado as e on p.estado = e."idEstado"';
        $params = null;
        return Database::getRows($sql, $params);
    }


}