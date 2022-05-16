<?php
/*
*	Clase para manejar la tabla comentarioArticulo de la base de datos.
*   Es clase hija de Validator.
*/
class Comentarios extends Validator
{
    // Declaración de atributos (propiedades) según nuestra tabla en la base de datos.
    private $id = null;
    private $cliente = null;
    private $articulo = null;
    private $titulo = null;
    private $descripcion = null;
    private $fecha = null;
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

    public function setCliente($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->cliente = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setArticulo($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->articulo = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setTitulo($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->titulo = $value;
            return true;
        } else {
            return false;
        }
    }


    public function setDescripcion($value)
    {
        if ($this->validateAlphabetic($value, 1, 350)) {
            $this->descripcion = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setFecha($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setEstado($value)
    {
        $this->estado = $value;
        return true;
    }
    /*
    *   Métodos para obtener valores de los atributos.
    */
    public function getId()
    {
        return $this->id;
    }

    public function getCliente()
    {
        return $this->cliente;
    }

    public function getArticulo()
    {
        return $this->articulo;
    }

    public function getTitulo()
    {
        return $this->titulo;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }

    public function getFecha()
    {
        return $this->fecha;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    /* 
    *   Método para comprobar que existen usuarios registrados en nuestra base de datos
    */
    public function readAll()
    {
        $sql = 'SELECT "idComentario", cl."nombresCliente", cl."apellidosCliente", a."tituloArticulo", "tituloComentario", "descripcionComentario", "fechaComentario", e."estado"
                from "comentarioArticulo" as ca inner join "cliente" as cl on ca."idCliente" = cl."idCliente"
                inner join "articulo" as a on ca."idArticulo" = a."idArticulo"
                inner join "estado" as e on ca."estado" = e."idEstado"
                order by "fechaComentario" desc';
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT "idComentario", cl."nombresCliente", cl."apellidosCliente", a."tituloArticulo", "tituloComentario", "descripcionComentario", "fechaComentario", ca."estado"
                from "comentarioArticulo" as ca inner join "cliente" as cl on ca."idCliente" = cl."idCliente"
                inner join "articulo" as a on ca."idArticulo" = a."idArticulo"
                where "idComentario" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readOneDetail()
    {
        $sql = 'SELECT "idComentario", cl."nombresCliente", cl."apellidosCliente", a."tituloArticulo", "tituloComentario", "descripcionComentario", "fechaComentario", e."estado"
                from "comentarioArticulo" as ca inner join "cliente" as cl on ca."idCliente" = cl."idCliente"
                inner join "articulo" as a on ca."idArticulo" = a."idArticulo"
                inner join "estado" as e on ca."estado" = e."idEstado"
                where "idComentario" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT "idComentario", cl."nombresCliente", cl."apellidosCliente", a."tituloArticulo", "tituloComentario", "descripcionComentario", "fechaComentario", e."estado"
                from "comentarioArticulo" as ca inner join "cliente" as cl on ca."idCliente" = cl."idCliente"
                inner join "articulo" as a on ca."idArticulo" = a."idArticulo"
                inner join "estado" as e on ca."estado" = e."idEstado"
                where "tituloArticulo" ILIKE ?
                order by "fechaComentario" desc';
        $params = array("%$value%");
        return Database::getRows($sql, $params);
    }

    /* UPDATE */
    public function updateRow()
    {
        $sql = 'UPDATE "comentarioArticulo"
                SET "estado" = ?
                WHERE "idComentario" = ?';
        $params = array($this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    /* DELETE */
    public function deleteRow()
    {
        //No eliminaremos registros, solo los inhabilitaremos
        $sql = 'UPDATE "comentarioArticulo" SET "estado" = 3 WHERE "idComentario" = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
