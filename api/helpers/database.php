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
        $database = 'dbCooke';
        $username = 'postgres';
        $password = 'admin';

        // Se crea la conexión mediante la extensión PDO y el controlador para PostgreSQL.
        self::$connection = new PDO('pgsql:host=' . $server . ';dbname=' . $database . ';port=5432', $username, $password);
    }
    
}