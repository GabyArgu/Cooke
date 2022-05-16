<?php
/*
*	Clase para manejar la tabla catalogo de colores de la base de datos de la tienda.
*   Es una clase hija de Validator.
*/
class categoriaCB extends Validator
{
    // Declaración de atributos (propiedades).
    private $id = null;
    private $nombre = null;
    private $descripcion = null;
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

    public function setNombre($value)
    {
        if ($this->validateAlphanumeric($value, 1, 50)) {
            $this->nombre = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setDescripcion($value)
    {
        if($this->validateString($value, 1, 250)) {
            $this->descripcion = $value;
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

    public function getNombre()
    {
        return $this->nombre;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }

    public function getEstado()
    {
        return $this->estado;
    }


    public function readAll()
    {
        $sql = 'SELECT * from "categoriaArticulo" ORDER BY "idCategoriaA"';
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT *
        FROM "categoriaArticulo"
        where "idCategoriaA" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT "nombreCategoriaA"
                FROM "categoriaArticulo"
                WHERE "categoriaArticulo" ILIKE ? ';
        $params = array("%$value%");
        return Database::getRows($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO "categoriaArticulo"("nombreCategoriaA", "descripcionCategoriaA", estado)
                VALUES (?,?, 1);';
        $params = array($this->nombre, $this->descripcion);
        return Database::executeRow($sql, $params);
    }


    /* UPDATE */
    public function updateRow()
    {
        $sql = 'UPDATE "categoriaArticulo"
                SET "nombreCategoriaA" = ?, "descripcionCategoriaA"=?,"estado" = ?
                WHERE "idCategoriaA" = ?';
            $params = array($this->nombre,$this->descripcion,$this->estado,$this->id);
        return Database::executeRow($sql, $params);
    }

    /* DELETE */
    /* Función para borrar un nombre de la base (Solo se inahbilita)*/
    public function deleteRow()
    {
        $sql = 'UPDATE "categoriaArticulo"
                SET estado = 2
                WHERE "idCategoriaA" = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}