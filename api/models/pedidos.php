<?php
/*
*	Clase para manejar la tabla pedidos de la base de datos.
*   Es clase hija de Validator.
*/
class Pedidos extends Validator
{
    // Declaración de atributos (propiedades) según nuestra tabla en la base de datos.
    private $id = null;
    private $cliente = null;
    private $fecha = null;
    private $total = null;
    private $estado = null;
    private $tipo_pago = null;
    private $color = null;
    private $idDetalle = null;
    private $producto = null;
    private $cantidad = null;
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
    public function setColor($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->color = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdDetalle($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->idDetalle = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setProducto($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->producto = $value;
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

    public function setFecha($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setTotal($value)
    {
        if ($this->validateMoney($value)) {
            $this->total = $value;
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

    public function setTipoPago($value)
    {
        $this->tipo_pago = $value;
        return true;
    }

    public function setCantidad($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->cantidad = $value;
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Métodos para obtener valores de los atributos.
    */
    public function getIdPedido()
    {
        return $this->id;
    }

    /* 
    *   Método para comprobar que existen pedidos registrados en nuestra base de datos
    */

    public function readAll()
    {
        $sql = 'SELECT "idPedido", c."nombresCliente", c."apellidosCliente", c."direccionCliente", c."telefonoCliente", "fechaPedido", ep."estadoPedido", "montoTotal", tp."tipoPago"
                from pedido as p inner join "cliente" as c using("idCliente")
                inner join "estadoPedido" as ep on p."estadoPedido" = ep."idEstadoPedido"
                inner join "tipoPago" as tp on p."tipoPago" = tp."idTipoPago"
                where p."estadoPedido" != 2
                order by "idPedido"';
        $params = null;
        return Database::getRows($sql, $params);
    }

    /* 
    *   Método para leer los datos del pedido seleccionado en el modal editar
    */

    public function readOne()
    {
        $sql = 'SELECT "idPedido", c."nombresCliente", c."apellidosCliente", c."direccionCliente", c."telefonoCliente", "fechaPedido", p."estadoPedido", "montoTotal", tp."tipoPago"
                from pedido as p inner join "cliente" as c using ("idCliente")
                inner join "tipoPago" as tp on p."tipoPago" = tp."idTipoPago"
                where "idPedido" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /* 
    *   Método para leer los datos del pedido seleccionado en el modal visualizar
    */

    public function readOneShow()
    {
        $sql = 'SELECT "idPedido", c."nombresCliente", c."apellidosCliente", c."direccionCliente", c."telefonoCliente", "fechaPedido", ep."estadoPedido", "montoTotal", tp."tipoPago"
                from pedido as p inner join "cliente" as c using ("idCliente")
                inner join "estadoPedido" as ep on p."estadoPedido" = ep."idEstadoPedido"
                inner join "tipoPago" as tp on p."tipoPago" = tp."idTipoPago"
                where "idPedido" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /* 
    *   Método para leer el detalle del pedido seleccionado en el modal visualizar
    */

    public function readOneDPShow()
    {
        $sql = 'SELECT "idDetallePedido", pr."imagenPrincipal", pr."nombreProducto", pr."precioProducto", "cantidadProducto", pr."precioProducto" * "cantidadProducto" as "subtotal"
                from "detallePedido" as dp inner join "pedido" as p on dp."idPedido" = p."idPedido"
                inner join "cliente" as cl on p."idCliente" = cl."idCliente"
                inner join "estadoPedido" as ep on p."estadoPedido" = ep."idEstadoPedido"
                inner join "colorStock" using ("idColorStock")
                inner join "producto" as pr using ("idProducto")
                where p."idPedido" = ?';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */

    /* SEARCH */

    public function searchRows($value)
    {
        $sql = 'SELECT "idPedido", c."nombresCliente", c."apellidosCliente", "fechaPedido", ep."estadoPedido", "montoTotal", tp."tipoPago"
                FROM pedido as p inner join "cliente" as c on p."idCliente" = c."idCliente"
                inner join "estadoPedido" as ep on p."estadoPedido" = ep."idEstadoPedido"
                inner join "tipoPago" as tp on p."tipoPago" = tp."idTipoPago"
                where CAST("idPedido" AS TEXT) ILIKE ?
                order by "idPedido"';
        $params = array("%$value%");
        return Database::getRows($sql, $params);
    }

    /* UPDATE */

    public function updateRow()
    {
        $sql = 'UPDATE "pedido"
                SET "estadoPedido" = ?
                WHERE "idPedido" = ?';
        $params = array($this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    /*
    *   MÉTODOS PARA EL SITIO PÚBLICO
    */

    /*
    *   Método para obtener los pedidos del cliente activo
    */

    public function readPedidosCliente()
    {
        $sql = 'SELECT "idPedido", "fechaPedido", ep."estadoPedido", "montoTotal"
                from pedido as p inner join "estadoPedido" as ep on p."estadoPedido" = ep."idEstadoPedido"
                inner join "cliente" as c on p."idCliente" = c."idCliente"
                where p."idCliente" = ?
                and ep."idEstadoPedido" != 2
                order by "idPedido"';
        $params = array($_SESSION['idCliente']);
        return Database::getRows($sql, $params);
    }

    /* Método para verificar si existe un pedido en proceso para seguir comprando, de lo contrario se crea uno.*/
    public function startOrder()
    {
        $this->estado = 2;

        $sql = 'SELECT "idPedido"
                    FROM pedido
                    WHERE "estadoPedido" = ? AND "idCliente" = ?';
        $params = array($this->estado, $_SESSION['idCliente']);
        if ($data = Database::getRow($sql, $params)) {
            $this->id = $data['idPedido'];
            return true;
        } else {
            $sql = 'INSERT INTO pedido("estadoPedido", "idCliente", "tipoPago")
                        VALUES(?, ?, ?)';
            $params = array($this->estado, $_SESSION['idCliente'], 1);
            // Se obtiene el ultimo valor insertado en la llave primaria de la tabla pedidos.
            if ($this->id = Database::getLastRow($sql, $params)) {
                return true;
            } else {
                return false;
            }
        }
    }

    // Método para agregar un producto al carrito de compras.
    public function createDetail()
    {
        // Se realiza una subconsulta para obtener el precio del producto.
        $sql = 'INSERT INTO "detallePedido"("idColorStock", "precioUnitario", "cantidadProducto", "idPedido")
            VALUES((SELECT "idColorStock" FROM "colorStock" WHERE "idProducto" = ? AND "idColor" = ?), (SELECT "precioProducto" FROM producto WHERE "idProducto" = ?), ?, ?)';
        $params = array($this->producto, $this->color, $this->producto, $this->cantidad, $this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para agregar un producto al carrito de compras.
    public function createDetailInicio()
    {
        // Se realiza una subconsulta para obtener el precio del producto.
        $sql = 'INSERT INTO "detallePedido"("idColorStock", "precioUnitario", "cantidadProducto", "idPedido")
            VALUES(?, (SELECT "precioProducto" FROM producto INNER JOIN "colorStock" USING("idProducto") WHERE "idColorStock" = ?), ?, ?)';
        $params = array($this->color, $this->color, 1, $this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para obtener los productos que se encuentran en el carrito de compras.
    public function readOrderDetail()
    {
        $sql = 'SELECT "idDetallePedido", "imagenPrincipal", "nombreProducto", "colorProducto", "detallePedido"."precioUnitario", "detallePedido"."cantidadProducto", "detallePedido"."idColorStock"
            FROM pedido INNER JOIN "detallePedido" USING("idPedido") INNER JOIN "colorStock" USING("idColorStock") INNER JOIN producto USING ("idProducto") INNER JOIN "colorProducto" USING("idColor")
            WHERE "idPedido" = ? 
            ORDER BY "idDetallePedido"';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    public function checkProducto($idProducto)
    {
        $sql = 'SELECT COUNT(*) 
            FROM "detallePedido" INNER JOIN "colorStock" USING ("idColorStock") INNER JOIN pedido USING ("idPedido")
            WHERE "colorStock"."idProducto" = ? AND "colorStock"."idColor" = ? AND "estadoPedido" = 2 AND "idCliente" = ?';
        $params = array($idProducto, $this->color, $_SESSION['idCliente']);
        return Database::registerExist($sql, $params);
    }

    public function checkProductoInicio()
    {
        $sql = 'SELECT COUNT(*) 
            FROM "detallePedido" INNER JOIN "colorStock" USING ("idColorStock") INNER JOIN pedido USING ("idPedido")
            WHERE "colorStock"."idColorStock" = ? AND "estadoPedido" = 2 AND "idCliente" = ?';
        $params = array($this->color, $_SESSION['idCliente']);
        return Database::registerExist($sql, $params);
    }

    public function readProductStock()
    {
        $sql = 'SELECT  stock
        FROM "colorStock" 
		WHERE "idColorStock" = ?';
        $params = array($this->color);
        return Database::getRow($sql, $params);
    }

    // Método para finalizar un pedido por parte del cliente.
    public function finishOrder()
    {
        // Se establece la zona horaria local para obtener la fecha del servidor.
        date_default_timezone_set('America/El_Salvador');
        $date = date('Y-m-d');
        $this->estado = 1;
        $sql = 'UPDATE pedido
                    SET "estadoPedido" = ?, "fechaPedido" = ?, "montoTotal" = ?
                    WHERE "idPedido" = ?';
        $params = array($this->estado, $date, $this->total, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    public function newStockProduct()
        {
            // Se establece la zona horaria local para obtener la fecha del servidor.
            $sql = 'UPDATE pedido
                    SET "estadoPedido" = ?, "fechaPedido" = ?, "montoTotal" = ?
                    WHERE "idPedido" = ?';
            $params = array($this->estado, $this->total, $_SESSION['idPedido']);
            return Database::executeRow($sql, $params);
        }

    // Método para actualizar la cantidad de un producto agregado al carrito de compras.
    public function updateDetail()
    {
        $sql = 'UPDATE "detallePedido"
                    SET "cantidadProducto" = ?
                    WHERE "idDetallePedido" = ? AND "idPedido" = ?';
        $params = array($this->cantidad, $this->idDetalle, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar un producto que se encuentra en el carrito de compras.
    public function deleteDetail()
    {
        $sql = 'DELETE FROM "detallePedido"
                    WHERE "idDetallePedido" = ? AND "idPedido" = ?';
        $params = array($this->idDetalle, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }
}
