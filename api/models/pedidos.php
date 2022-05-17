<?php
/*
*	Clase para manejar la tabla pedidos de la base de datos.
*   Es clase hija de Validator.
*/
class Pedidos extends Validator
{
    // Declaración de atributos (propiedades) según nuestra tabla en la base de datos.
    private $id = null;
    private $nombres_cliente = null;
    private $apellidos_cliente = null;
    private $fecha = null;
    private $estado = null;
    private $total = null;
    private $tipo_pago = null;
    private $imagen = null;
    private $producto = null;
    private $precio_unitario = null;
    private $cantidad = null;
    private $subtotal = null;
    private $direccion = null;
    private $telefono = null;

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

    public function setNombresCliente($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->nombres_cliente = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setApellidosCliente($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->apellidos_cliente = $value;
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

    public function setTotal($value)
    {
        if ($this->validateMoney($value)) {
            $this->total = $value;
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

    public function setImagen($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->imagen = $value;
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

    public function setPrecio($value)
    {
        if ($this->validateMoney($value)) {
            $this->precio_unitario = $value;
            return true;
        } else {
            return false;
        }
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

    public function setSubtotal($value)
    {
        if ($this->validateMoney($value)) {
            $this->subtotal = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setDireccion($value)
    {
        if ($this->validateAlphabetic($value, 1, 250)) {
            $this->direccion = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setTelefono($value)
    {
        if ($this->validatePhone($value)) {
            $this->telefono = $value;
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

    public function getNombresCliente()
    {
        return $this->nombres_cliente;
    }

    public function getApellidosCliente()
    {
        return $this->apellidos_cliente;
    }

    public function getFecha()
    {
        return $this->fecha;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    public function getTotal()
    {
        return $this->total;
    }

    public function getTipoPago()
    {
        return $this->tipo_pago;
    }

    public function getImagen()
    {
        return $this->imagen;
    }

    public function getProducto()
    {
        return $this->producto;
    }

    public function getPrecio()
    {
        return $this->precio_unitario;
    }

    public function getCantidad()
    {
        return $this->cantidad;
    }

    public function getSubtotal()
    {
        return $this->subtotal;
    }

    public function getDireccion()
    {
        return $this->direccion;
    }

    public function getTelefono()
    {
        return $this->telefono;
    }

    /* 
    *   Método para comprobar que existen pedidos registrados en nuestra base de datos
    */

    // Método para leer toda la información de los pedidos-------------------------.
    public function readAll()
    {
        $sql = 'SELECT "idPedido", c."nombresCliente", c."apellidosCliente", "fechaPedido", ep."estadoPedido", "montoTotal", tp."tipoPago"
                        from pedido as p inner join "cliente" as c on p."idCliente" = c."idCliente"
                        inner join "estadoPedido" as ep on p."estadoPedido" = ep."idEstadoPedido"
                        inner join "tipoPago" as tp on p."tipoPago" = tp."idTipoPago"
                        order by "idPedido", ep."estadoPedido"';
        $params = null;
        return Database::getRows($sql, $params);
    }

    // Método para un dato en especifico de los pedidos-------------------------.
    public function readOne()
    {
        $sql = 'SELECT "idPedido", "idCliente", "fechaPedido", "montoTotal", "estadoPedido", "tipoPago"
                FROM "pedido"
                WHERE "idPedido" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
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
        $params = array("%$value%", "%$value%");
        return Database::getRows($sql, $params);
    }
}
