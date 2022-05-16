<?php
/*
*	Clase para manejar la tabla catalogo de colores de la base de datos de la tienda.
*   Es una clase hija de Validator.
*/
class colorProducto extends Validator
{
    // Declaración de atributos (propiedades).
    private $id = null;
    private $nombreEtiqueta = null;
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

    public function setNombreEtiqueta($value)
    {
        if ($this->validateAlphanumeric($value, 1, 50)) {
            $this->nombre_etiqueta = $value;
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

    public function getNombreEtiqueta()
    {
        return $this->NombreEtiqueta;
    }

    public function getEstado()
    {
        return $this->estado;
    }


    public function readAll()
    {
        $sql = 'SELECT * from "nombreEtiqueta"';
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT *
        FROM "nombreEtiqueta"
        where "idEtiqueta" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT "nombreEtiqueta"
                FROM "nombreEtiqueta"
                WHERE "nombreEtiqueta" ILIKE ? ';
        $params = array("%$value%");
        return Database::getRows($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO "nombreEtiqueta"("nombreEtiqueta", idEstado)
                VALUES (?, 1);';
        $params = array($this->color);
        return Database::executeRow($sql, $params);
    }


    /* UPDATE */
    public function updateRow()
    {
        $sql = 'UPDATE "nombreEtiqueta"
                SET "nombreEtiqueta" = ?,
                "idEstado" = ?
                WHERE "idEtiqueta" = ?';
            $params = array($this->nombre_,$this->estado,$this->id);
        return Database::executeRow($sql, $params);
    }

    /* DELETE */
    
    public function deleteRow()
    {
        $sql = 'UPDATE "nombreEtiqueta"
                SET idEstado = 2
                WHERE "idEtiqueta" = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}