<?php

require_once 'class_db.php';
require_once 'class_respuesta.php';
require_once 'class_jwt.php';

class class_login
{

    public $db;
    public $Respuesta;
    public $jwt;

    public function __construct()
    {
        $this->db = new MysqliDb();
        $this->Respuesta = new class_respuesta();
        $this->jwt = new class_jwt();
    }

    public function login($datos)
    {
        $respuesta = null;
        try {
            $result = $this->db->rawQueryOne("CALL p_login (?,?)", $datos);
            if ($result) {
                $result = $this->jwt->jwt($result);
                $respuesta = $this->Respuesta->ok($result);
            } else {
                $respuesta = $this->Respuesta->error();
            }
        } catch (Exception $e) {
            $respuesta = $this->Respuesta->error();
        }
        return $respuesta;
    }

    public function actualizar_estado($datos)
    {
        $respuesta = null;
        try {
            $result = $this->db->rawQueryOne("CALL p_actualizar_estado (?)", $datos);
            $respuesta = $this->Respuesta->ok($result);
        } catch (Exception $e) {
            $respuesta = $this->Respuesta->error();
        }
        return $respuesta;
    }

    public function insertar_visita($datos)
    {
        $respuesta = null;
        try {
            $result = $this->db->rawQueryOne("CALL p_insertar_visita (?,?)", $datos);
            $respuesta = $this->Respuesta->ok($result);
        } catch (Exception $e) {
            $respuesta = $this->Respuesta->error();
        }
        return $respuesta;
    }

    public function get_img($datos)
    {
        $respuesta = null;
        try {
            $result = $this->db->rawQueryOne("SELECT usuario.avatar FROM usuario WHERE usuario.usuario = ? ", $datos);
            $respuesta = $this->Respuesta->ok($result);
        } catch (Exception $e) {
            $respuesta = $this->Respuesta->error();
        }
        return $respuesta;
    }

}