<?php
/*
*	Clase para manejar la tabla categorias de la base de datos.
*   Es clase hija de Validator.
*/
class Marca extends Validator
{
    // Declaración de atributos (propiedades).
    private $id = null;
    private $marca = null;
    private $imagen = null;
    private $estado = null;
    private $ruta = '../images/marcas/';

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

    public function setMarca($value)
    {
        if ($this->validateString($value, 1, 50)) {
            $this->marca = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setImagen($file)
    {
        if ($this->validateImageFile($file, 1000, 1000)) {
            $this->imagen = $this->getFileName();
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

    public function getMarca()
    {
        return $this->marca;
    }

    public function getImagen()
    {
        return $this->imagen;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    public function getRuta()
    {
        return $this->ruta;
    }

    // Método para leer toda la información de los colores existentes-------------------------.
    public function readAll()
    {
        $sql = 'SELECT "idMarca", "nombreMarca", "imagenMarca", e.estado FROM marca m INNER JOIN estado as e on m.estado = e."idEstado" 
        ORDER BY "idMarca"';
        $params = null;
        return Database::getRows($sql, $params);
    }

    // Método para un dato en especifico de los colores existentes-------------------------.
    public function readOne()
    {
        $sql = 'SELECT "idMarca", "nombreMarca", "imagenMarca", estado FROM marca  WHERE "idMarca" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT "idMarca", "nombreMarca", "imagenMarca", e.estado FROM marca m INNER JOIN estado as e on m.estado = e."idEstado" 
        WHERE "nombreMarca" ILIKE ?
		ORDER BY "idMarca"';
        $params = array("%$value%");
        return Database::getRows($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO marca(
            "nombreMarca", "imagenMarca", estado)
            VALUES (?, ?, ?);';
        $params = array($this->marca, $this->imagen, $this->estado);
        return Database::executeRow($sql, $params);
    }

    /* UPDATE */
    public function updateRow($current_image)
    {   
        // Se verifica si existe una nueva imagen para borrar la actual, de lo contrario se mantiene la actual.
        ($this->imagen) ? $this->deleteFile($this->getRuta(), $current_image) : $this->imagen = $current_image;

        $sql = 'UPDATE marca
            SET "nombreMarca"=?, "imagenMarca"=?, estado=?
            WHERE "idMarca"=?;';
            $params = array($this->marca, $this->imagen, $this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    /* DELETE */
    /* Función para borrar un color de la base (Solo se inahbilita)-------------------------*/
    public function deleteRow()
    {
        //No eliminaremos registros, solo los inhabilitaremos----------------------
        $sql = 'UPDATE marca SET estado = 3 WHERE "idMarca" = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
