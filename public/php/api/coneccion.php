<?php

$mysqli = new mysqli("localhost", "curnvirt_usrcons", "Unicurn2020", "curnvirt_consultorio");
if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$consulta = "INSERT INTO usuario
(usuario,clave) VALUES ('','')";

if (mysqli_query($mysqli,$consulta) ){
    echo "<p>Registro agregado.</p>";
    } else {
    echo "<p>No se agregó...</p>";
    }

?>