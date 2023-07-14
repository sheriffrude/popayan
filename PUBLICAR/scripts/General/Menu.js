$(function () {
    /*
    RequestHttp._Post(URL_VALIDAR_REGISTRO_HORAS_HOMBRE, null, function (respuesta) {
        if (respuesta != null) {
            if (respuesta.state == true) {
                var titulo = "Horas Hombre";
                var mensaje = "¿Desea cerrar el registro de actividades?";
                Utils._BuilderConfirmation(titulo, mensaje, 'RedireccionarModuloHorasHombre');
            } else
                Utils._BuilderMessage("danger", respuesta.mensaje);
        }
    });
    */
});

function RedireccionarModuloHorasHombre() {
    window.location = URL_REGISTRO_ACTIVIDADES;
}

function cambioPass() {
    return ('hola');
}
