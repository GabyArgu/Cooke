<?php
/*
*	Clase para manejar la tabla estado general de la base de datos.
*   Es clase hija de Validator.
*/
class Estado extends Validator
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


    // Método para leer los estados de las columnas existentes en la base-------------------------.
    public function readAll()
    {
        $sql = 'SELECT "idEstado", estado FROM estado';
        $params = null;
        return Database::getRows($sql, $params);
    }


}