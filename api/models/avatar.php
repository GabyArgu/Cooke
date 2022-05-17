<?php
/*
*	Clase para manejar la tabla avatar de la base de datos.
*   Es clase hija de Validator.
*/
class Avatar extends Validator
{
    // Declaración de atributos (propiedades).
    private $id = null;
    private $nombre = null;
    //Variable para un campo con imagen -------------------------.
    private $ruta = '../images/categorias/';

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


    // Método para leer toda la información de la tabla avatar-------------------------.
    public function readAll()
    {
        $sql = 'Select "idAvatar", "avatar" from "avatar"';
        $params = null;
        return Database::getRows($sql, $params);
    }


}