<?php
/*
*	Clase para manejar la tabla reseñas de la base de datos.
*   Es clase hija de Validator.
*/
class Reseñas extends Validator
{
    // Declaración de atributos (propiedades) según nuestra tabla en la base de datos.
    private $id = null;
    private $cliente = null;
    private $detalle_pedido = null;
    private $titulo = null;
    private $descripcion = null;
    private $puntaje = null;
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

    public function setDetallePedido($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->detalle_pedido = $value;
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

    public function setPuntaje($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->puntaje = $value;
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

    public function getDetallePedido()
    {
        return $this->detalle_pedido;
    }

    public function getTitulo()
    {
        return $this->titulo;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }

    public function getPuntaje()
    {
        return $this->puntaje;
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

    // Método para leer toda la información de las reseñas existentes-------------------------.
    public function readAll()
    {
        $sql = 'SELECT  "idResena", c."nombresCliente", c."apellidosCliente", pr."nombreProducto", "tituloResena", "descripcionResena", "puntajeResena", "fechaResena", e."estado"
                from "resena" as r inner join "cliente" as c on r."idCliente" = c."idCliente"
                inner join "estado" as e on r."estado" = e."idEstado"
                inner join "detallePedido" as dp on r."idDetalle" = dp."idDetallePedido"
                inner join "colorStock" using ("idColorStock")
                inner join "producto" as pr using ("idProducto")
                order by "fechaResena" desc';
        $params = null;
        return Database::getRows($sql, $params);
    }

    // Método para abrir el modal de editar de las reseñas-------------------------.
    public function readOne()
    {
        $sql = 'SELECT "idResena", c."nombresCliente", c."apellidosCliente", pr."nombreProducto", "tituloResena", "descripcionResena", "puntajeResena", "fechaResena", "estado"
                from "resena" as r inner join "cliente" as c using ("idCliente")
                inner join "detallePedido" as dp on r."idDetalle" = dp."idDetallePedido"
                inner join "colorStock" using ("idColorStock")
                inner join "producto" as pr using ("idProducto")
                where "idResena" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Método para abrir el modal de detalles de las reseñas-------------------------.
    public function readOneDetail()
    {
        $sql = 'SELECT  "idResena", c."nombresCliente", c."apellidosCliente", pr."nombreProducto", "tituloResena", "descripcionResena", "puntajeResena", "fechaResena", e."estado"
                from "resena" as r inner join "cliente" as c using ("idCliente")
                inner join "estado" as e on r."estado" = e."idEstado"
                inner join "detallePedido" as dp on r."idDetalle" = dp."idDetallePedido"
                inner join "colorStock" using ("idColorStock")
                inner join "producto" as pr using ("idProducto")
                where "idResena" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT "idResena", c."nombresCliente", c."apellidosCliente", pr."nombreProducto", "tituloResena", "descripcionResena", "puntajeResena", "fechaResena", e."estado"
                from "resena" as r inner join "cliente" as c using ("idCliente")
                inner join "estado" as e on r."estado" = e."idEstado"
                inner join "detallePedido" as dp on r."idDetalle" = dp."idDetallePedido"
                inner join "colorStock" using ("idColorStock")
                inner join "producto" as pr using ("idProducto")
                where "nombreProducto" ILIKE ?
                order by "fechaResena" desc';
        $params = array("%$value%");
        return Database::getRows($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO resena(
            "idCliente", "idDetalle", "tituloResena", "descripcionResena", "puntajeResena", "fechaResena", estado)
            VALUES (?, ?, ?, ?, ?, ?, 1);';
        $params = array($this->cliente, $this->detalle_pedido, $this->titulo, $this->descripcion, $this->puntaje, $this->fecha, $this->estado);
        return Database::executeRow($sql, $params);
    }

    /* UPDATE */
    public function updateRow()
    {
        $sql = 'UPDATE "resena"
                SET "estado" = ?
                WHERE "idResena" = ?';
            $params = array($this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    /* DELETE */

    /* Función para inhabilitar un reseña ya que no los borraremos de la base------------------------- */
    public function deleteRow()
    {
        //No eliminaremos registros, solo los inhabilitaremos-------------------------.
        $sql = 'UPDATE "resena" SET "estado" = 3 WHERE "idResena" = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }



    public function productReview($value)
    {
        $sql = 'SELECT "idResena", c."avatar", c."nombresCliente", c."apellidosCliente", pr."nombreProducto", "tituloResena", "descripcionResena", "puntajeResena", "fechaResena", e."estado"
                from "resena" as r inner join "cliente" as c using ("idCliente")
                inner join "estado" as e on r."estado" = e."idEstado"
                inner join "detallePedido" as dp on r."idDetalle" = dp."idDetallePedido"
                inner join "colorStock" using ("idColorStock")
                inner join "producto" as pr using ("idProducto")
                where "idProducto" = ?
                AND e.estado = ?
                order by "fechaResena" desc';
        $params = array($value, 'Activo');
        return Database::getRows($sql, $params);
    }

    public function doReview()
    {
        $sql = 'INSERT INTO public.resena(
            "idCliente", "idDetalle", "tituloResena", "descripcionResena", "puntajeResena", "fechaResena", estado)
            VALUES (?, (SELECT MAX(dp."idDetallePedido")
                        from "detallePedido" as dp inner join "colorStock" using("idColorStock")
                        inner join producto using("idProducto")
                        inner join pedido using("idPedido")
                        where "idProducto" = ?
                        AND pedido."idCliente" = ? AND "estadoPedido" = 1), ?, ?, ?, CURRENT_DATE, 1)';
        $params = array($_SESSION['idCliente'], $this->id, $_SESSION['idCliente'], $this->titulo, $this->descripcion, $this->puntaje);
        return Database::executeRow($sql, $params);
    }
}
