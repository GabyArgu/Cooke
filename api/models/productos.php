<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class Productos extends Validator
{
    // Declaración de atributos (propiedades) según nuestra tabla en la base de datos.
    private $id = null;
    private $nombre = null;
    private $descripcion = null;
    private $precio = null;
    private $subcategoria = null;
    private $proveedor = null;
    private $marca = null;
    private $estado = null;
    private $color = null;
    private $stock = null;
    private $imagen = null;
    private $ruta = '../images/productos/';

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
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->nombre = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setPrecio($value)//validaciones
    {
        if ($this->validateMoney($value)) {
            $this->precio = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setSubcategoria($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->subcategoria = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setProveedor($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->proveedor = $value;
            return true;
        } else {
            return false;
        }
    }
    public function setMarca($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->marca = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setDescripcion($value)
    {
        if($this->validateString($value, 1, 400)) {
            $this->descripcion = $value;
            return true;
        } else {
            return false;
        }
        
    }

    public function setImagen($file)
    {
        if ($this->validateImageFile($file, 500, 500)) {
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

    public function setColor($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->color = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setStock($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->stock = $value;
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

    public function getPrecio()
    {
        return $this->precio;
    }

    public function getSubcategoria()
    {
        return $this->subcategoria;
    }

    public function getProveedor()
    {
        return $this->proveedor;
    }

    public function getMarca()
    {
        return $this->marca;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }

    public function getImagen()
    {
        return $this->imagen;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    public function getColor()
    {
        return $this->color;
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
        $sql = 'SELECT "idProducto", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", ep."estadoProducto" 
        FROM producto as p inner join "estadoProducto" as ep on p."estadoProducto" = ep."idEstadoProducto" 
        ORDER BY "idProducto"
        ';
        
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT "idProducto", "idSubCategoriaP", "idProveedor", "idMarca", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", "estadoProducto"
        FROM producto 
        WHERE "idProducto" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }
    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT "idProducto", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", ep."estadoProducto" 
        FROM producto as p inner join "estadoProducto" as ep on p."estadoProducto" = ep."idEstadoProducto"
        WHERE "nombreProducto" ILIKE ? OR "descripcionProducto" ILIKE ?
        ORDER BY "idProducto"';
        $params = array("%$value%", "%$value%");
        return Database::getRows($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO producto(
        "idSubCategoriaP", "idProveedor", "idMarca", "nombreProducto", "descripcionProducto", "precioProducto", "estadoProducto", "imagenPrincipal")
        VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING "idProducto";';
        $params = array($this->subcategoria, $this->proveedor, $this->marca, $this->nombre, $this->descripcion, $this->precio, $this->estado, $this->imagen);
        return Database::executeRow($sql, $params);
    }

    /* Función para obtener el id del último registro ingresado*/
    public function getLastId()
    {
        $sql = 'SELECT MAX("idProducto") as "idProducto" FROM producto ';
        return Database::getRowId($sql);
    }

    public function insertStock($lastId)
    {
        $sql = 'INSERT INTO "colorStock"(
        "idProducto", "idColor", stock)
        VALUES (?, ?, ?);';
        $params = array($lastId, $this->color, $this->stock);
        return Database::executeRow($sql, $params);
    }

    /* UPDATE */
    public function updateRow($current_image)
    {   
        // Se verifica si existe una nueva imagen para borrar la actual, de lo contrario se mantiene la actual.
        ($this->imagen) ? $this->deleteFile($this->getRuta(), $current_image) : $this->imagen = $current_image;

        $sql = 'UPDATE "subcategoriaProducto"
                SET "idCategoriaP"=?, "nombreSubCategoriaP"=?, "descripcionSubCategoriaP"=?, "imagenSubcategoria"=?, estado=?
                WHERE "idSubCategoriaP" = ?;';
            $params = array($this->categoria, $this->nombre, $this->descripcion, $this->imagen, $this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    /* DELETE */
    /* Función para inhabilitar un usuario ya que no los borraremos de la base*/
    public function deleteRow()
    {
        //No eliminaremos registros, solo los inhabilitaremos
        $sql = 'UPDATE producto SET "estadoProducto" = 3 WHERE "idProducto" = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}