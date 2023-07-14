var TAREA_FINALIZAR = {
    OnComplete: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);
        if (resultado != null) {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success";
                TAREA_LISTAR.RecargarTablaPage();
                TAREA_PENDIENTE_LISTAR.RecargarTablaPage();
                TAREA_CONTESTADA_LISTAR.RecargarTablaPage();
                Utils._CloseModal();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
        }
    }
}