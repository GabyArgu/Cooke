<?php

class Database
{
    // Propiedades de la clase para manejar las acciones respectivas.
    private static $connection = null;
    private static $statement = null;
    private static $error = null;

    /*
    *   Método para establecer la conexión con el servidor de base de datos.
    */
    private static function conectar()
    {
        // Credenciales para establecer la conexión con la base de datos.
        $server = 'localhost';
        $database = 'dbcooke';
        $username = 'postgres';
        $password = 'admin';

        // Se crea la conexión mediante la extensión PDO y el controlador para PostgreSQL.
        self::$connection = new PDO('pgsql:host=' . $server . ';dbname=' . $database . ';port=5432', $username, $password);
    }
/*
    *   Método para ejecutar las siguientes sentencias SQL: insert, update y delete.
    *
    *   Parámetros: $query (sentencia SQL) y $values (arreglo de valores para la sentencia SQL).
    *   
    *   Retorno: booleano (true si la sentencia se ejecuta satisfactoriamente o false en caso contrario).
    */
    public static function executeRow($query, $values)
    {
        try {
            self::conectar();
            self::$statement = self::$connection->prepare($query);
            $state = self::$statement->execute($values);
            // Se anula la conexión con el servidor de base de datos.
            self::$connection = null;
            return $state;
        } catch (PDOException $error) {
            // Se obtiene el código y el mensaje de la excepción para establecer un error personalizado.
            self::setException($error->getCode(), $error->getMessage());
            return false;
        }
    }
    
    /*
    *   Método para obtener el valor de la llave primaria del último registro insertado.
    *
    *   Parámetros: $query (sentencia SQL) y $values (arreglo de valores para la sentencia SQL).
    *   
    *   Retorno: numérico entero (último valor de la llave primaria si la sentencia se ejecuta satisfactoriamente o 0 en caso contrario).
    */
    public static function getLastRow($query, $values)
    {
        try {
            self::conectar();
            self::$statement = self::$connection->prepare($query);
            if (self::$statement->execute($values)) {
                $id = self::$connection->lastInsertId();
            } else {
                $id = 0;
            }
            // Se anula la conexión con el servidor de base de datos.
            self::$connection = null;
            return $id;
        } catch (PDOException $error) {
            // Se obtiene el código y el mensaje de la excepción para establecer un error personalizado.
            self::setException($error->getCode(), $error->getMessage());
            return 0;
        }
    }

    /*
    *   Método para obtener un registro de una sentencia SQL tipo SELECT.
    *
    *   Parámetros: $query (sentencia SQL) y $values (arreglo de valores para la sentencia SQL).
    *   
    *   Retorno: arreglo asociativo del registro si la sentencia SQL se ejecuta satisfactoriamente o false en caso contrario.
    */
    public static function getRow($query, $values)
    {
        try {
            self::conectar();
            self::$statement = self::$connection->prepare($query);
            self::$statement->execute($values);
            // Se anula la conexión con el servidor de base de datos.
            self::$connection = null;
            return self::$statement->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $error) {
            // Se obtiene el código y el mensaje de la excepción para establecer un error personalizado.
            self::setException($error->getCode(), $error->getMessage());
            die(self::getException());
        }
    }
    
    /*
    *   Método para verificar la existencia de un registro.
    *
    *   Parámetros: $query (sentencia SQL) y $values (arreglo de valores para la sentencia SQL).
    *   
    *   Retorno: True si existe, false si no existe.
    */
    public static function registerExist($query, $values)
    {
        try {
            self::conectar();
            self::$statement = self::$connection->prepare($query);
            self::$statement->execute($values);
            // Se anula la conexión con el servidor de base de datos.
            self::$connection = null;
            $registro = self::$statement->fetchColumn();
            if($registro>0){
                return true;
            }
            else{
                return false;
            }
            
        } catch (PDOException $error) {
            // Se obtiene el código y el mensaje de la excepción para establecer un error personalizado.
            self::setException($error->getCode(), $error->getMessage());
            die(self::getException());
        }
    }

    /*
    *   Método para obtener un registro de una sentencia SQL tipo SELECT.
    *
    *   Parámetros: $query (sentencia SQL) y $values (arreglo de valores para la sentencia SQL).
    *   
    *   Retorno: arreglo asociativo del registro si la sentencia SQL se ejecuta satisfactoriamente o false en caso contrario.
    */
    public static function getRowId($query, $values)
    {
        try {
            self::conectar();
            self::$statement = self::$connection->prepare($query);
            self::$statement->execute($values);
            // Se anula la conexión con el servidor de base de datos.
            $idReturn = self::$statement->fetchColumn();
            self::$connection = null;
            return  $idReturn;
        } catch (PDOException $error) {
            // Se obtiene el código y el mensaje de la excepción para establecer un error personalizado.
            self::setException($error->getCode(), $error->getMessage());
            die(self::getException());
        }
    }
    /*
    *   Método para obtener todos los registros de una sentencia SQL tipo SELECT.
    *
    *   Parámetros: $query (sentencia SQL) y $values (arreglo de valores para la sentencia SQL).
    *
    *   Retorno: arreglo asociativo de los registros si la sentencia SQL se ejecuta satisfactoriamente o false en caso contrario.
    */
    public static function getRows($query, $values)
    {
        try {
            self::conectar();
            self::$statement = self::$connection->prepare($query);
            self::$statement->execute($values);
            // Se anula la conexión con el servidor de base de datos.
            self::$connection = null;
            return self::$statement->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $error) {
            // Se obtiene el código y el mensaje de la excepción para establecer un error personalizado.
            self::setException($error->getCode(), $error->getMessage());
            die(self::getException());
        }
    }
    /*
    *   Método para establecer un mensaje de error personalizado al ocurrir una excepción.
    *
    *   Parámetros: $code (código del error) y $message (mensaje original del error).
    *
    *   Retorno: ninguno.
    */
    private static function setException($code, $message)
    {
        // Se asigna el mensaje del error original por si se necesita.
        self::$error = utf8_encode($message);
        // Se compara el código del error para establecer un error personalizado.
        switch ($code) {
            case '7':
                self::$error = 'Existe un problema al conectar con el servidor';
                break;
            case '42703':
                self::$error = $message;
                break;
            case '23505':
                $cadena = $message;
                //strtok corta la cadena en el caracter especificado
                $token = strtok($cadena, '"'); // Primer token
                $token = strtok('"'); 
                $cadena = $token;
                $token = strtok('('); 
                $token = strtok(')'); 
                $campo = $token;

                self::$error = "El campo " . $cadena . "= " . $campo . "\n" . "ya está registrado.";
                break;
            case '42P01':
                self::$error = 'Nombre de tabla desconocido';
                break;
            case '23503':
                self::$error = $message;
                break;
            default:
                self::$error;
        }
    }

    /*
    *   Método para obtener un error personalizado cuando ocurre una excepción.
    *
    *   Parámetros: ninguno.
    *
    *   Retorno: error personalizado de la sentencia SQL o de la conexión con el servidor de base de datos.
    */
    public static function getException()
    {
        return self::$error;
    }
}