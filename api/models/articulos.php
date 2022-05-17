<?php
/*
*	Clase para manejar la tabla articulos de la base de datos.
*   Es clase hija de Validator.
*/
class Articulos extends Validator
{
    // Declaración de atributos (propiedades) según nuestra tabla en la base de datos.
    private $id = null;
    private $empleado = null;
    private $categoria = null;
    private $titulo = null;
    private $contenido = null;
    private $fecha = null;
    private $imagen = null;
    private $estado = null;
    private $ruta = '../images/articulos/';

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

    public function setEmpleado($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setCategoria($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->categoria = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setTitulo($value)
    {
        if($this->validateString($value, 1, 50)) {
            $this->titulo = $value;
            return true;
        } else {
            return false;
        }
        
    }

    public function setContenido($value)
    {
        if($this->validateString($value, 1, 1500)) {
            $this->contenido = $value;
            return true;
        } else {
            return false;
        }
        
    }

    public function setFecha($value)
    {
        if($this->validateDate($value)) {
            $this->fecha = $value;
            return true;
        } else {
            return false;
        }
        
    }

    public function setImagen($file)
    {
        if ($this->validateImageFile($file, 3500, 1850)) {
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

    public function getEmpleado()
    {
        return $this->empleado;
    }

    public function getCategoria()
    {
        return $this->categoria;
    }

    public function getTitulo()
    {
        return $this->titulo;
    }

    public function getContenido()
    {
        return $this->contenido;
    }

    public function getFecha(){
        return $this->fecha; 
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

    /* 
    *   Método para comprobar que existen subcategorias registradas en nuestra base de datos
    */
    public function readAll()
    {
        $sql = 'SELECT "idArticulo", em."nombresEmpleado", em."apellidosEmpleado", c."nombreCategoriaA", "tituloArticulo", "contenidoArticulo", "fechaArticulo", e."estado", "imagenArticulo" 
                from "articulo" as a inner join "empleado" as em on a."idEmpleado" = em."idEmpleado"
                inner join "categoriaArticulo" as c on a."idCategoriaA" = c."idCategoriaA"
                inner join "estado" as "e" on a."estado" = e."idEstado"
                order by "fechaArticulo", "estado" desc';
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT "idArticulo", "idEmpleado", "idCategoriaA", "tituloArticulo", "contenidoArticulo", "fechaArticulo", "estado", "imagenArticulo"  
                FROM "articulo"
                WHERE "idArticulo" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readOneDetail()
    {
        $sql = 'SELECT "idArticulo", em."nombresEmpleado", em."apellidosEmpleado", c."nombreCategoriaA", "tituloArticulo", "contenidoArticulo", "fechaArticulo", e."estado", "imagenArticulo"  
                from "articulo" as a inner join "empleado" as em on a."idEmpleado" = em."idEmpleado"
                inner join "categoriaArticulo" as c on a."idCategoriaA" = c."idCategoriaA"
                inner join "estado" as "e" on a."estado" = e."idEstado"
                order by "fechaArticulo", "estado" desc';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT "idArticulo", em."nombresEmpleado", em."apellidosEmpleado", c."nombreCategoriaA", "tituloArticulo", "contenidoArticulo", "fechaArticulo", e."estado", "imagenArticulo"  
                from "articulo" as a inner join "empleado" as em on a."idEmpleado" = em."idEmpleado"
                inner join "categoriaArticulo" as c on a."idCategoriaA" = c."idCategoriaA"
                inner join "estado" as "e" on a."estado" = e."idEstado"
                where "tituloArticulo" ILIKE ?
                order by "fechaArticulo", "estado" desc';
        $params = array("%$value%");
        return Database::getRows($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO "articulo"("idEmpleado", "idCategoriaA", "tituloArticulo", "contenidoArticulo", "fechaArticulo", "estado", "imagenArticulo")
        VALUES (?, ?, ?, ?, ?, ?, ?);';
        $params = array($this->empleado, $this->categoria, $this->titulo, $this->contenido, $this->fecha, $this->estado, $this->imagen);
        return Database::executeRow($sql, $params);
    }

    /* UPDATE */
    public function updateRow($current_image)
    {   
        // Se verifica si existe una nueva imagen para borrar la actual, de lo contrario se mantiene la actual.
        ($this->imagen) ? $this->deleteFile($this->getRuta(), $current_image) : $this->imagen = $current_image;

        $sql = 'UPDATE "articulo"
                SET "idEmpleado"=?, "idCategoriaA"=?, "tituloArticulo"=?, "contenidoArticulo"=?, "fechaArticulo"=?, estado=?, "imagenArticulo"=?
                WHERE "idArticulo" = ?;';
            $params = array($this->empleado, $this->categoria, $this->titulo, $this->contenido, $this->fecha, $this->estado, $this->imagen, $this->id);
        return Database::executeRow($sql, $params);
    }

    /* DELETE */
    /* Función para inhabilitar un usuario ya que no los borraremos de la base*/
    public function deleteRow()
    {
        //No eliminaremos registros, solo los inhabilitaremos
        $sql = 'UPDATE "articulo" SET estado = 3 WHERE "idArticulo" = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}