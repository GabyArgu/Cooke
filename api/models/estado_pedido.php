<?php
/*
*	Clase para manejar la tabla categorias de la base de datos.
*   Es clase hija de Validator.
*/
class EstadoPedido extends Validator
{
    // Declaración de atributos (propiedades).
    private $id = null;
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

    public function setEstado($value)
    {
        if ($this->validateAlphanumeric($value, 1, 50)) {
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

    public function getEstado()
    {
        return $this->estado;
    }


    public function readAll()
    {
        $sql = 'SELECT "idEstadoPedido", "estadoPedido" FROM "estadoPedido" 
        WHERE "idEstadoPedido" != 2';
        $params = null;
        return Database::getRows($sql, $params);
    }


}