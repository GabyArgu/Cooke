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
        $this->estado = $value;
        return true;
    }

    public function setTipoPago($value)
    {
        $this->tipo_pago = $value;
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

    public function getFecha()
    {
        return $this->fecha;
    }
    
    public function getTotal()
    {
        return $this->total;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    public function getTipoPago()
    {
        return $this->tipo_pago;
    }
    /* 
    *   Método para comprobar que existen pedidos registrados en nuestra base de datos
    */

    public function readAll()
    {
        $sql = 'SELECT "idPedido", c."nombresCliente", c."apellidosCliente", c."direccionCliente", c."telefonoCliente", "fechaPedido", ep."estadoPedido", "montoTotal", tp."tipoPago"
                        from pedido as p inner join "cliente" as c on p."idCliente" = c."idCliente"
                        inner join "estadoPedido" as ep on p."estadoPedido" = ep."idEstadoPedido"
                        inner join "tipoPago" as tp on p."tipoPago" = tp."idTipoPago"
                        order by "idPedido"';
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT "SELECT "idPedido", c."nombresCliente", c."apellidosCliente", c."direccionCliente", c."telefonoCliente", "fechaPedido", p."estadoPedido", "montoTotal", tp."tipoPago"
                from pedido as p inner join "cliente" as c on p."idCliente" = c."idCliente"
                inner join "tipoPago" as tp on p."tipoPago" = tp."idTipoPago"
                where "idPedido" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readOneDetail()
    {
        $sql = ' SELECT "idPedido", c."nombresCliente", c."apellidosCliente", c."direccionCliente", c."telefonoCliente", fechaPedido", ep."estadoPedido", "montoTotal", tp."tipoPago"
                from pedido as p inner join "cliente" as c on p."idCliente" = c."idCliente"
                inner join "estadoPedido" as ep on p."estadoPedido" = ep."idEstadoPedido"
                inner join "tipoPago" as tp on p."tipoPago" = tp."idTipoPago"
                where "idPedido" = ?';
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
