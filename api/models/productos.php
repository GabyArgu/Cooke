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
    private $descuento = null;
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

    public function setPrecio($value) //validaciones
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
        if ($this->validateString($value, 1, 400)) {
            $this->descripcion = $value;
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
        if ($this->validateStock($value)) {
            $this->stock = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setDescuento($value)
    {
        if ($this->validateStock($value)) {
            $this->descuento = $value;
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

    public function getStock()
    {
        return $this->stock;
    }

    public function getDescuento()
    {
        return $this->descuento;
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
        $sql = 'SELECT p."idProducto", "idSubCategoriaP", "idProveedor", "idMarca", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", "estadoProducto", "idColor", stock, descuento 
        FROM producto as p inner join "colorStock" as cs on p."idProducto" = cs."idProducto"
        WHERE p."idProducto" =  ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readProductStock()
    {
        $sql = 'SELECT  stock
        FROM "colorStock"
		WHERE "idProducto" = ? and "idColor" = ?;';
        $params = array($this->id, $this->color);
        return Database::getRow($sql, $params);
    }

    public function readOneShow()
    {
        $sql = 'SELECT p."idProducto", "nombreSubCategoriaP", "nombreMarca", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", ep."estadoProducto", cp."idColor",cp."colorProducto", stock, fecha, descuento 
        FROM producto as p inner join "colorStock" as cs on p."idProducto" = cs."idProducto"
		inner join "subcategoriaProducto" as sp on p."idSubCategoriaP" = sp."idSubCategoriaP"
		inner join "estadoProducto" as ep on p."estadoProducto" = ep."idEstadoProducto"
		inner join marca as m on p."idMarca" = m."idMarca"
		inner join "colorProducto" as cp on cs."idColor" = cp."idColor"
        WHERE p."idProducto" =  ?';
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

    public function searchRowsPublic($value)
    {
        $sql = 'SELECT Distinct on ("idProducto") "idProducto", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", descuento, "estadoProducto", "idColorStock", "idColor", p."idSubCategoriaP"
        FROM producto as p INNER JOIN "marca" USING("idMarca") INNER JOIN "colorStock" USING("idProducto")
		WHERE ("nombreProducto" ILIKE ? OR "nombreMarca" ILIKE ?) AND "idSubCategoriaP" = ? AND "estadoProducto" = 1 
		ORDER BY "idProducto"';
        $params = array("%$value%", "%$value%", $this->id);
        return Database::getRows($sql, $params);
    }

    public function filterPrecio($min, $max)
    {
        $sql = 'SELECT Distinct on ("idProducto") "idProducto", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", descuento, "estadoProducto", "idColorStock", "idColor", p."idSubCategoriaP"
        FROM producto as p INNER JOIN "marca" USING("idMarca") INNER JOIN "colorStock" USING("idProducto")
		WHERE  "idSubCategoriaP" = ? AND "estadoProducto" = 1 AND "precioProducto" BETWEEN ? AND ?
		ORDER BY "idProducto"';
        $params = array($this->id, $min, $max);
        return Database::getRows($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO producto(
        "idSubCategoriaP", "idProveedor", "idMarca", "nombreProducto", "descripcionProducto", "precioProducto", "estadoProducto", "imagenPrincipal", descuento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING "idProducto";';
        $params = array($this->subcategoria, $this->proveedor, $this->marca, $this->nombre, $this->descripcion, $this->precio, $this->estado, $this->imagen, $this->descuento);
        if ($this->id = Database::getRowId($sql, $params)) {
            return true;
        } else {
            return false;
        }
    }


    public function insertStock()
    {
        $sql = 'INSERT INTO "colorStock"(
        "idProducto", "idColor", stock, fecha)
        VALUES (?, ?, ?, CURRENT_DATE);';
        $params = array($this->id, $this->color, $this->stock);
        return Database::executeRow($sql, $params);
    }

    /* UPDATE */
    public function updateRow($current_image)
    {
        // Se verifica si existe una nueva imagen para borrar la actual, de lo contrario se mantiene la actual.
        ($this->imagen) ? $this->deleteFile($this->getRuta(), $current_image) : $this->imagen = $current_image;

        $sql = 'UPDATE producto
            SET "idSubCategoriaP"=?, "idProveedor"=?, "idMarca"=?, "nombreProducto"=?, "descripcionProducto"=?, "precioProducto"=?, "estadoProducto"=?, "imagenPrincipal"=?, descuento = ?
            WHERE "idProducto"=?;';
        $params = array($this->subcategoria, $this->proveedor, $this->marca, $this->nombre, $this->descripcion, $this->precio, $this->estado, $this->imagen, $this->descuento, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function updateStock()
    {
        $sql = 'SELECT COUNT (*)
                FROM "colorStock"
                WHERE "idColor" = ? and "idProducto" = ?';
        $params = array($this->color, $this->id);

        if (Database::registerExist($sql, $params)) {
            $sql = 'UPDATE "colorStock" set stock = ?, fecha = CURRENT_DATE WHERE "idColor" = ? AND "idProducto" = ?;';
            $params = array($this->stock, $this->color, $this->id);
            return Database::executeRow($sql, $params);
        } else {
            $sql = 'INSERT INTO "colorStock"("idProducto", "idColor", stock, fecha) VALUES(?, ?, ?, CURRENT_DATE)';
            $params = array($this->id, $this->color, $this->stock);
            return Database::executeRow($sql, $params);
        }
    }
    /* Actualizar el estado automaticamente*/
    public function updateStateProduct()
    {
        $sql = 'CALL actualizarEstadoProducto(?);';
        $params = array($this->id);
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


    /* Funciones para mostrar productos en público */
    public function readDestacados()
    {
        $sql = 'SELECT "idProducto", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", descuento, ep."estadoProducto", "idColorStock"
        FROM producto as p inner join "estadoProducto" as ep on p."estadoProducto" = ep."idEstadoProducto" INNER JOIN "colorStock" USING("idProducto")
		WHERE descuento >=25
        ORDER BY "idProducto"
        ';

        $params = null;
        return Database::getRows($sql, $params);
    }

    public function readProductosSubcategoria()
    {
        $sql = 'SELECT Distinct on ("idProducto") "idProducto", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", descuento, ep."estadoProducto", "idColorStock", "idColor", p."idSubCategoriaP"
        FROM producto as p inner join "estadoProducto" as ep on p."estadoProducto" = ep."idEstadoProducto" INNER JOIN "colorStock" USING("idProducto")
		WHERE "idSubCategoriaP" = ? AND p."estadoProducto" = 1
		ORDER BY "idProducto"';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    /*
    *   Métodos para generar gráficas.
    */
    public function ventasPorSemana()
    {
        $sql = 'SELECT to_char("fechaPedido", \'Day\') as "Día", extract(day from "fechaPedido") as "Fecha", sum("montoTotal") as total from pedido 
        where "fechaPedido" between (select current_date - cast(\'7 days\' as interval))  and (select current_date- cast(\'1 days\' as interval)) 
        group by "fechaPedido" order by "fechaPedido"';
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function estadisticaVentasPorSemana()
    {
        $sql = 'SELECT sum("montoTotal") as total from pedido 
        where "fechaPedido" between (select current_date - cast(\'7 days\' as interval))  and (select current_date)';
        $params = null;
        return Database::getRow($sql, $params);
    }

    public function ventasPorSemanaCategoria1()
    {
        $sql = 'SELECT to_char("fechaPedido", \'Day\') as "Día", extract(day from "fechaPedido") as "Fecha", "nombreCategoriaP", sum(getmonto("idPedido")) as total
        from pedido 
        inner join "detallePedido" using("idPedido")
        inner join "colorStock" using("idColorStock")
        inner join producto using("idProducto")
        inner join "subcategoriaProducto" using("idSubCategoriaP")
        inner join "categoriaProducto" on "subcategoriaProducto"."idCategoriaP" = "categoriaProducto"."idCategoria"
        where "fechaPedido" between (select current_date - cast(\'7 days\' as interval))  and (select current_date - cast(\'1 days\' as interval)) and "estadoPedido" = 1 and "idCategoria"=1
        group by "nombreCategoriaP", "fechaPedido"';
        $params = null;
        return Database::getRows($sql, $params);
    }

    /* Métodos para generar gráfica grande */
    public function ventasPorSemanaCategoria2()
    {
        $sql = 'SELECT to_char("fechaPedido", \'Day\') as "Día", extract(day from "fechaPedido") as "Fecha", "nombreCategoriaP", sum(getmonto("idPedido")) as total
        from pedido 
        inner join "detallePedido" using("idPedido")
        inner join "colorStock" using("idColorStock")
        inner join producto using("idProducto")
        inner join "subcategoriaProducto" using("idSubCategoriaP")
        inner join "categoriaProducto" on "subcategoriaProducto"."idCategoriaP" = "categoriaProducto"."idCategoria"
        where "fechaPedido" between (select current_date - cast(\'7 days\' as interval))  and (select current_date - cast(\'1 days\' as interval)) and "estadoPedido" = 1 and "idCategoria"=2
        group by "nombreCategoriaP", "fechaPedido"';
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function ventasPorSemanaCategoria3()
    {
        $sql = 'SELECT to_char("fechaPedido", \'Day\') as "Día", extract(day from "fechaPedido") as "Fecha", "nombreCategoriaP", sum(getmonto("idPedido")) as total
        from pedido 
        inner join "detallePedido" using("idPedido")
        inner join "colorStock" using("idColorStock")
        inner join producto using("idProducto")
        inner join "subcategoriaProducto" using("idSubCategoriaP")
        inner join "categoriaProducto" on "subcategoriaProducto"."idCategoriaP" = "categoriaProducto"."idCategoria"
        where "fechaPedido" between (select current_date - cast(\'7 days\' as interval))  and (select current_date - cast(\'1 days\' as interval)) and "estadoPedido" = 1 and "idCategoria"=3
        group by "nombreCategoriaP", "fechaPedido"';
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function ventasPorSemanaCategoria4()
    {
        $sql = 'SELECT to_char("fechaPedido", \'Day\') as "Día", extract(day from "fechaPedido") as "Fecha", "nombreCategoriaP", sum(getmonto("idPedido")) as total
        from pedido 
        inner join "detallePedido" using("idPedido")
        inner join "colorStock" using("idColorStock")
        inner join producto using("idProducto")
        inner join "subcategoriaProducto" using("idSubCategoriaP")
        inner join "categoriaProducto" on "subcategoriaProducto"."idCategoriaP" = "categoriaProducto"."idCategoria"
        where "fechaPedido" between (select current_date - cast(\'7 days\' as interval))  and (select current_date - cast(\'1 days\' as interval)) and "estadoPedido" = 1 and "idCategoria"=4
        group by "nombreCategoriaP", "fechaPedido"';
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function productosPorMarca()
    {
        $sql = 'SELECT count(*) as cantidad, "nombreMarca"
                from producto
                inner join marca using("idMarca")
                where producto."estadoProducto" = 1
                group by "nombreMarca"';
        $params = null;
        return Database::getRows($sql, $params);
    }
}
