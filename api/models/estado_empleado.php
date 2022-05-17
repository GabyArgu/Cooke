<?php
/*
*	Clase para manejar la tabla estado empleado de la base de datos.
*   Es clase hija de Validator.
*/
class EstadoEmpleado extends Validator
{
    // Declaración de atributos (propiedades).
    private $id = null;
    private $nombre = null;

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

    public function setNombre($value)
    {
        if ($this->validateAlphanumeric($value, 1, 50)) {
            $this->nombre = $value;
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

    public function getNombre()
    {
        return $this->nombre;
    }


    // Método para leer todlos estados de empleados existentes-------------------------.
    public function readAll()
    {
        $sql = 'Select "idEstadoEmpleado", "estadoEmpleado" from "estadoEmpleado"';
        $params = null;
        return Database::getRows($sql, $params);
    }


}